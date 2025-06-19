// Variable que controla si estamos en modo oscuro o no
let isDarkMode = false;

// Obtiene la referencia a la capa de oscurecimiento
const darkOverlay = document.getElementById('darkOverlay');

// Selecciona todos los elementos de texto (títulos y párrafos)
const textElements = document.querySelectorAll('h2, h3, p, dt, dd, label, li, b ');

// Selecciona los contenedores de imágenes
const imageContainers = document.querySelectorAll('.image-container');

// Selecciona TODOS los botones especiales con la clase "special-button"
const specialButtons = document.querySelectorAll('.special-button');

// Preparar todos los botones especiales
function prepareSpecialButtons() {
  // Para cada botón con la clase "special-button"
  specialButtons.forEach(button => {
    // Guardar el texto original
    const originalText = button.textContent;
    
    // Crear contenedor para el texto
    const buttonTextContainer = document.createElement('div');
    buttonTextContainer.className = 'button-text';
    
    // Dividir texto en caracteres
    for (let i = 0; i < originalText.length; i++) {
      const charSpan = document.createElement('span');
      charSpan.className = 'char' + (originalText[i] === ' ' ? ' space' : '');
      charSpan.innerText = originalText[i];
      buttonTextContainer.appendChild(charSpan);
    }
    
    // Crear fondos para el botón
    const lightBg = document.createElement('div');
    lightBg.className = 'light-bg';
    
    const darkBg = document.createElement('div');
    darkBg.className = 'dark-bg';
    
    // Vaciar el botón y agregar los nuevos elementos
    button.textContent = '';
    button.appendChild(lightBg);
    button.appendChild(darkBg);
    button.appendChild(buttonTextContainer);
  });
}

// Función que divide el texto en palabras y caracteres
function splitTextIntoChars(element) {
  const text = element.innerText;
  element.innerHTML = '';
  
  // Dividir el texto en palabras y espacios
  const words = text.split(/(\s+)/);
  
  words.forEach(word => {
    // Crear contenedor de palabra
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    
    // Manejar espacios como elementos individuales
    if (word.match(/\s+/)) {
      wordSpan.classList.add('space-word');
      wordSpan.innerHTML = '&nbsp;'; // Usar espacio no rompible
    } else {
      // Dividir palabra en caracteres
      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'char' + (word[i] === ' ' ? ' space' : '');
        charSpan.innerText = word[i];
        wordSpan.appendChild(charSpan);
      }
    }
    
    element.appendChild(wordSpan);
  });
}

// Procesa todos los elementos de texto
textElements.forEach(element => splitTextIntoChars(element));

// efecto nuevo
// Aplicar efecto visual solo al saludo principal
document.querySelectorAll('#saludoPrincial .char').forEach(span => {
  span.classList.add('effect');
});


// Preparamos todos los botones especiales
prepareSpecialButtons();

let animationFrameId = null;

// Función para alternar entre modo claro y oscuro
function toggleDarkMode() {
  // Deshabilita transiciones temporales para cambios instantáneos
  imageContainers.forEach(container => {
    const light = container.querySelector('.light-image');
    const dark = container.querySelector('.dark-image');
    light.style.transition = dark.style.transition = 'none';
  });
  
  // Deshabilita transiciones para todos los botones especiales
  specialButtons.forEach(button => {
    const lightBg = button.querySelector('.light-bg');
    const darkBg = button.querySelector('.dark-bg');
    lightBg.style.transition = darkBg.style.transition = 'none';
  });
  
  // Forzar reflow para aplicar los cambios de estilos inmediatamente
  void document.body.offsetHeight;
  
  // Cambiamos la posición del overlay según el modo actual
  if (!isDarkMode) {
    // Pasamos a modo oscuro (overlay se desliza de izquierda a derecha)
    darkOverlay.style.left = '0';
    
    // Añadimos la clase 'dark' a todos los botones especiales
    specialButtons.forEach(button => {
      button.classList.add('dark');
    });
    
    // Añadimos la clase dark-mode al body
    document.body.classList.add('dark-mode');
  } else {
    // Pasamos a modo claro (overlay se desliza fuera de la pantalla)
    darkOverlay.style.left = '-100%';
    
    // Quitamos la clase 'dark' de todos los botones especiales
    specialButtons.forEach(button => {
      button.classList.remove('dark');
    });
    
    // Quitamos la clase dark-mode del body
    document.body.classList.remove('dark-mode');
  }
  
  // Iniciamos la animación correspondiente
  startAnimation(!isDarkMode);
  
  // Actualizamos el estado del modo
  isDarkMode = !isDarkMode;
}

// Función para iniciar la animación
function startAnimation(toWhite) {
  // Detenemos cualquier animación previa
  stopAnimation();

  // Seleccionamos todos los caracteres y obtenemos el ancho de la ventana
  const chars = document.querySelectorAll('.char');
  const overlayWidth = window.innerWidth;

  // Función de actualización que se ejecuta en cada frame de animación
  function updateElements() {
    // Obtenemos la posición actual del overlay
    const currentLeft = parseFloat(window.getComputedStyle(darkOverlay).left);
    const overlayRightEdge = currentLeft + overlayWidth;

    // Animación de texto - actualizamos el color de cada carácter
    chars.forEach(char => {
      const charRect = char.getBoundingClientRect();
      const charCenter = charRect.left + charRect.width / 2;
      
      // Determinar si el carácter está cubierto por el overlay
      const isCovered = charCenter <= overlayRightEdge;
      
      // Asignar el color correspondiente
      char.style.color = isCovered ? 'white' : 'black';
    });

    // Animación de imágenes - actualizamos la opacidad de cada imagen
    imageContainers.forEach(container => {
      const containerRect = container.getBoundingClientRect();
      const lightImg = container.querySelector('.light-image');
      const darkImg = container.querySelector('.dark-image');
      
      // Calculamos cuánto del contenedor está cubierto
      const overlapStart = Math.max(currentLeft, containerRect.left);
      const overlapEnd = Math.min(overlayRightEdge, containerRect.right);
      const overlap = Math.max(0, overlapEnd - overlapStart);
      const coveragePercentage = overlap / containerRect.width;
      
      // Aplicamos las opacidades correspondientes
      lightImg.style.opacity = 1 - coveragePercentage;
      darkImg.style.opacity = coveragePercentage;
    });

    // Animación para todos los botones especiales
    specialButtons.forEach(button => {
      const buttonRect = button.getBoundingClientRect();
      const lightBg = button.querySelector('.light-bg');
      const darkBg = button.querySelector('.dark-bg');
      
      // Calculamos cuánto del botón está cubierto
      const buttonOverlapStart = Math.max(currentLeft, buttonRect.left);
      const buttonOverlapEnd = Math.min(overlayRightEdge, buttonRect.right);
      const buttonOverlap = Math.max(0, buttonOverlapEnd - buttonOverlapStart);
      const buttonCoveragePercentage = buttonOverlap / buttonRect.width;
      
      // Aplicamos las opacidades correspondientes
      lightBg.style.opacity = 1 - buttonCoveragePercentage;
      darkBg.style.opacity = buttonCoveragePercentage;
    });

    // Verificamos si la animación ha terminado
    const animationComplete = toWhite 
      ? currentLeft >= 0 
      : currentLeft <= -overlayWidth;

    // Si la animación no ha terminado, programamos el siguiente frame
    if (!animationComplete) {
      animationFrameId = requestAnimationFrame(updateElements);
    } else {
      // Restauramos las transiciones para futuras animaciones
      imageContainers.forEach(container => {
        const lightImg = container.querySelector('.light-image');
        const darkImg = container.querySelector('.dark-image');
        
        lightImg.style.transition = darkImg.style.transition = 'opacity 1.5s';
        
        // Establecemos las opacidades finales según el modo
        if (toWhite) {
          lightImg.style.opacity = '0';
          darkImg.style.opacity = '1';
        } else {
          lightImg.style.opacity = '1';
          darkImg.style.opacity = '0';
        }
      });
      
      // Restauramos las transiciones para todos los botones especiales
      specialButtons.forEach(button => {
        const lightBg = button.querySelector('.light-bg');
        const darkBg = button.querySelector('.dark-bg');
        
        lightBg.style.transition = darkBg.style.transition = 'opacity 1.5s';
        
        // Establecemos las opacidades finales según el modo
        if (toWhite) {
          lightBg.style.opacity = '0';
          darkBg.style.opacity = '1';
        } else {
          lightBg.style.opacity = '1';
          darkBg.style.opacity = '0';
        }
      });
    }
  }

  // Iniciamos la animación
  updateElements();
}

// Función para detener la animación
function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}