const contenedor = document.getElementById('contenedor');
const svg = document.getElementById('svg');
const path = document.getElementById('path');

// Botones
const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

// Valores base
const baseWidth = 300;
const baseHeight = 200;
const baseH = 400;
const step = 50;

let currentWidth = baseWidth;
let currentHeight = baseHeight;

let espejado = false; // por defecto, no espejado

const directionBtn = document.getElementById('direction');

function actualizarTamano() {
  contenedor.style.width = currentWidth + 'px';
  contenedor.style.height = currentHeight + 'px';

  svg.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);

  // Aplicar espejo si está activado
  const stroke = path.getAttribute("stroke-width");
  const offsetVisual = stroke; // Vale lo mismo que la variable Stroke, pero se declara para que pueda ser mas escalable y entendible

  if (espejado) {
    svg.style.transform = 'scaleX(-1)';
    svg.style.transformOrigin = 'left';
    svg.style.marginLeft = `${offsetVisual * 2}px`;
  } else {
    svg.style.transform = 'none';
    svg.style.marginLeft = '0px';
  }

  const offsetY = currentHeight - baseHeight;
  const hFinal = Math.round((currentWidth / baseWidth) * baseH / step) * step;

  const newPath = `M2 0 V${100 + offsetY} Q2 ${199 + offsetY} 100 ${199 + offsetY} H${hFinal}`;
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

// Inicializar
actualizarTamano();
