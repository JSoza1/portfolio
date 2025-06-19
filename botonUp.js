// Selecciona el botón
const btnUp = document.getElementById("btn-up");

// Mostrar u ocultar el botón al hacer scroll
window.onscroll = function () {
  if (document.documentElement.scrollTop > 300) {
    btnUp.style.display = "block"; // Mostrar
  } else {
    btnUp.style.display = "none"; // Ocultar
  }
};

// Al hacer clic, desplaza hacia arriba suavemente
btnUp.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


//boton de copiado

  function copiarTexto() {
    const textoCopiar = "jsoza993@gmail.com";
    const botonCopiar = document.getElementById("btnCopiar");

    // Copia el texto al portapapeles
    navigator.clipboard.writeText(textoCopiar);

    // Guarda el texto original para restaurarlo después
    const textoOriginal = botonCopiar.textContent;
    
    // Cambia el texto temporalmente
    botonCopiar.textContent = "¡Copiado!";

  }