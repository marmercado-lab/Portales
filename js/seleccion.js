const espacioPortales = document.querySelector("#espacioPortales");
const listaSeleccionados = document.querySelector("#listaSeleccionados");
const mensajeSeleccion = document.querySelector("#mensajeSeleccion");
const botonContinuar = document.querySelector("#botonContinuar");

const seleccionados = [];
let zIndexActual = 100;

crearPortales();

function crearPortales() {
    if (!espacioPortales) {
        console.error("No se encontró #espacioPortales");
        return;
    }

    if (typeof portales === "undefined") {
        console.error("No se cargó datos-portales.js");
        return;
    }

    portales.forEach(function (portal, indice) {
        const elemento = document.createElement("article");

        elemento.classList.add("portal");
        elemento.dataset.id = portal.id;
        elemento.dataset.nombre = portal.nombre;
        elemento.dataset.categoria = portal.categoria;

        const imagen = document.createElement("img");

        imagen.src = `imagenes/portales/${portal.archivo}`;
        imagen.alt = portal.nombre;
        imagen.draggable = false;

        elemento.appendChild(imagen);
        espacioPortales.appendChild(elemento);

        posicionarPortal(elemento, indice);
        activarArrastre(elemento);
        activarSeleccion(elemento, portal);
    });
}


/*
Distribuye los portales alrededor de los bordes
y deja una zona central libre para el texto.
*/
function posicionarPortal(elemento, indice) {
    const anchoVentana = window.innerWidth;
    const altoVentana = window.innerHeight;

    /*
    Deben coincidir aproximadamente con el tamaño
    definido en seleccion.css.
    */
    const anchoPortal = 125;
    const altoPortal = 125;

    const margenExterior = 15;

    /*
    Zona central que queremos mantener despejada.
    Ajusta estos porcentajes para hacerla más grande
    o más pequeña.
    */
    const centroIzquierda = anchoVentana * 0.23;
    const centroDerecha = anchoVentana * 0.72;
    const centroArriba = altoVentana * 0.30;
    const centroAbajo = altoVentana * 0.70;

    /*
    Repartimos las imágenes en cuatro zonas.
    */
    const zonas = [
        "izquierda",
        "derecha",
        "arriba",
        "abajo"
    ];

    const zona = zonas[indice % zonas.length];

    let x = 0;
    let y = 0;

    if (zona === "izquierda") {
        const espacioDisponibleX =
            centroIzquierda -
            anchoPortal -
            margenExterior;

        x =
            margenExterior +
            Math.random() * Math.max(0, espacioDisponibleX);

        y =
            margenExterior +
            Math.random() *
                Math.max(
                    0,
                    altoVentana -
                        altoPortal -
                        margenExterior * 2
                );
    }

    if (zona === "derecha") {
        const inicioX = centroDerecha;

        const espacioDisponibleX =
            anchoVentana -
            inicioX -
            anchoPortal -
            margenExterior;

        x =
            inicioX +
            Math.random() * Math.max(0, espacioDisponibleX);

        y =
            margenExterior +
            Math.random() *
                Math.max(
                    0,
                    altoVentana -
                        altoPortal -
                        margenExterior * 2
                );
    }

    if (zona === "arriba") {
        x =
            margenExterior +
            Math.random() *
                Math.max(
                    0,
                    anchoVentana -
                        anchoPortal -
                        margenExterior * 2
                );

        const espacioDisponibleY =
            centroArriba -
            altoPortal -
            margenExterior;

        y =
            margenExterior +
            Math.random() * Math.max(0, espacioDisponibleY);
    }

    if (zona === "abajo") {
        const inicioY = centroAbajo;

        x =
            margenExterior +
            Math.random() *
                Math.max(
                    0,
                    anchoVentana -
                        anchoPortal -
                        margenExterior * 2
                );

        const espacioDisponibleY =
            altoVentana -
            inicioY -
            altoPortal -
            margenExterior;

        y =
            inicioY +
            Math.random() * Math.max(0, espacioDisponibleY);
    }

    /*
    Pequeña variación para que no parezca una grilla perfecta.
    */
    x += Math.random() * 20 - 10;
    y += Math.random() * 20 - 10;

    const rotacion = Math.random() * 10 - 5;
    const duracion = 6 + Math.random() * 4;
    const retraso = Math.random() * -6;

    elemento.style.left = `${x}px`;
    elemento.style.top = `${y}px`;
    elemento.style.zIndex = indice + 1;

    elemento.style.setProperty(
        "--rotacion-inicial",
        `${rotacion}deg`
    );

    elemento.style.animationDuration = `${duracion}s`;
    elemento.style.animationDelay = `${retraso}s`;
}


function activarSeleccion(elemento, portal) {
    elemento.addEventListener("click", function () {
        const yaSeleccionado = seleccionados.some(function (item) {
            return item.id === portal.id;
        });

        if (yaSeleccionado) {
            quitarSeleccion(portal.id, elemento);
            return;
        }

        if (seleccionados.length >= 3) {
            return;
        }

        seleccionados.push(portal);
        elemento.classList.add("seleccionado");

        actualizarInterfaz();
    });
}


function quitarSeleccion(id, elemento) {
    const indice = seleccionados.findIndex(function (item) {
        return item.id === id;
    });

    if (indice !== -1) {
        seleccionados.splice(indice, 1);
    }

    if (elemento) {
        elemento.classList.remove("seleccionado");
    }

    actualizarInterfaz();
}


function actualizarInterfaz() {
    listaSeleccionados.innerHTML = "";

    if (seleccionados.length === 0) {
        listaSeleccionados.innerHTML =
            '<span class="seleccion-vacia">0 / 3</span>';
    } else {
        seleccionados.forEach(function (portal) {
            const etiqueta = document.createElement("button");

            etiqueta.type = "button";
            etiqueta.classList.add("etiqueta-seleccion");
            etiqueta.textContent = `${portal.nombre} ×`;

            etiqueta.addEventListener("click", function () {
                const elemento = document.querySelector(
                    `.portal[data-id="${portal.id}"]`
                );

                quitarSeleccion(portal.id, elemento);
            });

            listaSeleccionados.appendChild(etiqueta);
        });
    }

    if (seleccionados.length === 0) {
        mensajeSeleccion.textContent =
            "elige 3 portales por los que quieras ver a través";
    }

    if (seleccionados.length === 1) {
        mensajeSeleccion.textContent =
            "escoge dos portales más";
    }

    if (seleccionados.length === 2) {
        mensajeSeleccion.textContent =
            "escoge 1 portal más";
    }

    if (seleccionados.length === 3) {
        mensajeSeleccion.textContent =
            "tu selección está lista...";
    }

    botonContinuar.disabled = seleccionados.length !== 3;
}


function activarArrastre(elemento) {
    let arrastrando = false;
    let desplazamientoX = 0;
    let desplazamientoY = 0;
    let inicioX = 0;
    let inicioY = 0;
    let seMovio = false;

    elemento.addEventListener("pointerdown", function (evento) {
        arrastrando = true;
        seMovio = false;

        inicioX = evento.clientX;
        inicioY = evento.clientY;

        const rect = elemento.getBoundingClientRect();

        desplazamientoX = evento.clientX - rect.left;
        desplazamientoY = evento.clientY - rect.top;

        zIndexActual += 1;
        elemento.style.zIndex = zIndexActual;

        elemento.setPointerCapture(evento.pointerId);
    });

    elemento.addEventListener("pointermove", function (evento) {
        if (!arrastrando) {
            return;
        }

        const distanciaX = evento.clientX - inicioX;
        const distanciaY = evento.clientY - inicioY;

        if (
            Math.abs(distanciaX) > 5 ||
            Math.abs(distanciaY) > 5
        ) {
            seMovio = true;
        }

        const nuevaX = evento.clientX - desplazamientoX;
        const nuevaY = evento.clientY - desplazamientoY;

        elemento.style.left = `${nuevaX}px`;
        elemento.style.top = `${nuevaY}px`;
    });

    elemento.addEventListener("pointerup", function (evento) {
        arrastrando = false;

        if (elemento.hasPointerCapture(evento.pointerId)) {
            elemento.releasePointerCapture(evento.pointerId);
        }

        if (seMovio) {
            elemento.dataset.acabaDeArrastrar = "true";

            window.setTimeout(function () {
                elemento.dataset.acabaDeArrastrar = "false";
            }, 80);
        }
    });

    elemento.addEventListener("pointercancel", function () {
        arrastrando = false;
    });

    elemento.addEventListener(
        "click",
        function (evento) {
            if (elemento.dataset.acabaDeArrastrar === "true") {
                evento.stopImmediatePropagation();
            }
        },
        true
    );
}


botonContinuar.addEventListener("click", function () {
    if (seleccionados.length !== 3) {
        return;
    }

    localStorage.setItem(
        "portalesSeleccionados",
        JSON.stringify(seleccionados)
    );

    window.location.href = "resultado.html";
});