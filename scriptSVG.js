const contenedor = document.getElementById('contenedor');
const svg = document.getElementById('svg');
const path = document.getElementById('path');

// Botones
const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

// Inputs
const strokeInput = document.getElementById('strokeInput');
const percentageInput = document.getElementById('percentageInput');
const directionBtn = document.getElementById('direction');

// Valores base
const baseWidth = 150;
const baseHeight = 200;
const step = 50;

let currentWidth = baseWidth;
let currentHeight = baseHeight;
let espejado = false; // por defecto, no espejado

function actualizarStrokeDash() {
  const totalLength = path.getTotalLength();
  const percentage = parseInt(percentageInput.value, 10) || 0;

  // Calcula la longitud visible desde el comienzo del path
  const visibleLength = (percentage / 100) * totalLength;
  console.log(`(${percentage}) / 100 * ${totalLength} = ${(percentage / 100) * totalLength}`);

  // Dash completo, y offset para ocultar desde el final hacia el inicio
  path.style.strokeDasharray = totalLength;
  path.style.strokeDashoffset = totalLength - visibleLength;
}

function actualizarTamano() {
  contenedor.style.width = currentWidth + 'px';
  contenedor.style.height = currentHeight + 'px';

  svg.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);

  // Obtener el stroke y su offset visual
  const stroke = parseFloat(path.getAttribute("stroke-width")) || 0;
  const offsetVisual = stroke / 2;

  // Espejar visualmente si está activado
  if (espejado) {
    svg.style.transform = 'scaleX(-1)';
    svg.style.transformOrigin = 'left';
    svg.style.marginLeft = `${offsetVisual * 2}px`;
  } else {
    svg.style.transform = 'none';
    svg.style.marginLeft = '0px';
  }

  // Coordenadas para el path
  const yFinal = currentHeight - offsetVisual;
  const yCurva = yFinal;

  // Que la línea no exceda el tamaño visible
  const hFinal = currentWidth - offsetVisual;

  // Nuevo path que encaja en el viewBox
  const newPath = `M${offsetVisual} 0 V${yFinal - 100} Q${offsetVisual} ${yCurva} 100 ${yCurva} H${hFinal}`;

  path.setAttribute('d', newPath);
  actualizarStrokeDash();
}

// Eventos de botones de dirección
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

// Cambiar dirección (espejar)
directionBtn.addEventListener('click', () => {
  espejado = !espejado;
  actualizarTamano();
});

// Cambiar grosor del trazo
strokeInput.addEventListener('input', (event) => {
  const newStroke = isNaN(parseInt(event.target.value, 10)) ? 10 : parseInt(event.target.value, 10);
  path.setAttribute("stroke-width", newStroke);
  actualizarTamano();
});

// Actualizar el porcentaje visible del trazo
percentageInput.addEventListener('input', () => {
  actualizarStrokeDash();
});

// Inicializar
actualizarTamano();
