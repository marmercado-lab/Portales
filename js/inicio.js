const imagenesEstela = [
    "imagenes/estela/cursor-1.png",
    "imagenes/estela/cursor-2.png",
    "imagenes/estela/cursor-3.png",
    "imagenes/estela/cursor-4.png"
];

let ultimaX = 0;
let ultimaY = 0;

const distanciaMinima = 45;
const duracionEstela = 1200;

document.addEventListener("mousemove", function (evento) {
    const distanciaX = evento.clientX - ultimaX;
    const distanciaY = evento.clientY - ultimaY;

    const distanciaRecorrida = Math.sqrt(
        distanciaX * distanciaX +
        distanciaY * distanciaY
    );

    if (distanciaRecorrida < distanciaMinima) {
        return;
    }

    crearImagenEstela(evento.clientX, evento.clientY);

    ultimaX = evento.clientX;
    ultimaY = evento.clientY;
});

function crearImagenEstela(x, y) {
    const imagen = document.createElement("img");

    const indiceAleatorio = Math.floor(
        Math.random() * imagenesEstela.length
    );

    imagen.src = imagenesEstela[indiceAleatorio];
    imagen.classList.add("imagen-estela");

    const rotacionAleatoria = Math.random() * 24 - 12;
    const escalaAleatoria = 0.8 + Math.random() * 0.4;

    imagen.style.left = `${x}px`;
    imagen.style.top = `${y}px`;

    imagen.style.setProperty(
        "--rotacion",
        `${rotacionAleatoria}deg`
    );

    imagen.style.setProperty(
        "--escala",
        escalaAleatoria
    );

    document.body.appendChild(imagen);

    window.setTimeout(function () {
        imagen.remove();
    }, duracionEstela);
}


/* Formulario de nombre */

const formulario = document.querySelector("#formularioNombre");
const inputNombre = document.querySelector("#nombre");
const mensajeError = document.querySelector("#mensajeError");

if (formulario && inputNombre && mensajeError) {
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = inputNombre.value.trim();

        if (nombre === "") {
            mensajeError.textContent =
                "Escribe tu nombre para continuar.";

            inputNombre.focus();
            return;
        }

        mensajeError.textContent = "";

        localStorage.setItem("nombreParticipante", nombre);

        window.location.href = "seleccion.html";
    });
}
