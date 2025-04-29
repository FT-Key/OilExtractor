const contenedor = document.getElementById('contenedor');
const svg = document.getElementById('svg');
const path = document.getElementById('path');

// Botones
const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

//Inputs
const strokeInput = document.getElementById('strokeInput');

// Valores base
const baseWidth = 150;
const baseHeight = 200;
const baseH = 400;
const step = 50;

let currentWidth = baseWidth;
let currentHeight = baseHeight;

let espejado = false; // por defecto, no espejado

const directionBtn = document.getElementById('direction');

const percentageInput = document.getElementById('percentageInput');

function actualizarStrokeDash() {
  const totalLength = path.getTotalLength();
  const percentage = parseInt(percentageInput.value, 10) || 0;
  const visibleLength = (percentage / 100) * totalLength;

  path.style.strokeDasharray = totalLength;
  path.style.strokeDashoffset = totalLength - visibleLength;
}

// Evento para actualizar el porcentaje
percentageInput.addEventListener('input', () => {
  actualizarStrokeDash();
});

// También llamalo al final de actualizarTamano()
function actualizarTamano() {
  // ... todo tu código actual ...
  path.setAttribute('d', newPath);
  actualizarStrokeDash(); // <- Llama aquí para mantener sincronización
}

function actualizarTamano() {
  contenedor.style.width = currentWidth + 'px';
  contenedor.style.height = currentHeight + 'px';

  svg.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);

  // Obtener el valor de stroke-width y calcular el offset visual
  const stroke = parseFloat(path.getAttribute("stroke-width")) || 0;
  const offsetVisual = stroke / 2; // Mitad del stroke para no cortar la línea

  // Aplicar espejo si está activado
  if (espejado) {
    svg.style.transform = 'scaleX(-1)';
    svg.style.transformOrigin = 'left';
    svg.style.marginLeft = `${offsetVisual * 2}px`;
  } else {
    svg.style.transform = 'none';
    svg.style.marginLeft = '0px';
  }

  // Línea curva inferior a 2px del borde
  const yFinal = currentHeight - offsetVisual;
  const yCurva = yFinal; // La curva queda al borde inferior del SVG

  // Calcular la longitud final de la línea horizontal (hFinal) en función del tamaño actual
  const hFinal = Math.round((currentWidth / baseWidth) * baseH / step) * step;

  // Modificar el path con el valor de offsetVisual para asegurar que el trazo no se corte
  const newPath = `M${offsetVisual} 0 V${yFinal + offsetVisual - 100} Q${offsetVisual} ${yCurva} 100 ${yCurva} H${hFinal}`;

  // Actualizar el atributo 'd' del path con el nuevo valor
  path.setAttribute('d', newPath);
}

// Eventos para botones
upBtn.addEventListener('click', () => {
  if (currentHeight - step >= 100) {
    currentHeight -= step;
    actualizarTamano();
  }
});

downBtn.addEventListener('click', () => {
  if (currentHeight + step <= 800) {
    currentHeight += step;
    actualizarTamano();
  }
});

rightBtn.addEventListener('click', () => {
  if (!espejado) {
    if (currentWidth + step <= 800) {
      currentWidth += step;
    }
  } else {
    if (currentWidth - step >= 100) {
      currentWidth -= step;
    }
  }
  actualizarTamano();
});

leftBtn.addEventListener('click', () => {
  if (!espejado) {
    if (currentWidth - step >= 100) {
      currentWidth -= step;
    }
  } else {
    if (currentWidth + step <= 800) {
      currentWidth += step;
    }
  }
  actualizarTamano();
});

directionBtn.addEventListener('click', () => {
  espejado = !espejado;
  actualizarTamano();
});

// Actualizar el stroke-width al cambiar el input
strokeInput.addEventListener('input', (event) => {
  const newStroke = isNaN(parseInt(event.target.value, 10)) ? 10 : parseInt(event.target.value, 10);
  path.setAttribute("stroke-width", newStroke);
  actualizarTamano();
});

// Inicializar
actualizarTamano();
