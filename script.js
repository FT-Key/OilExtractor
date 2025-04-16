const canvas = document.getElementById('paisaje');
const ctx = canvas.getContext('2d');

// Proporciones (deben sumar 1 en total)
const proporciones = {
  cielo: 0.3,
  cesped: 0.01,
  tierraClara: 0.25,
};
proporciones.tierraOscura = 1 - (
  proporciones.cielo +
  proporciones.cesped +
  proporciones.tierraClara
);

let movimientoLateral = 20;
let movimientoVertical = 10;
let largoTuberia = 100;  // Longitud inicial de la tubería
let direccionTuberia = 'derecha';  // Dirección inicial de la tubería
let profundidadTuberia = 0.5; // Valor entre 0 (parte superior) y 1 (parte inferior)
let profundidadReal = 0; // valor actual en metros (negativo)
let profundidadMaxima = -100; // cambiá esto si querés mayor escala (ej: -1000)

function dibujarReglaAltura() {
  // Obtener la posición Y de la tierra clara (inicio de la regla)
  const yInicio = canvas.height * (proporciones.cielo + proporciones.cesped);

  // Obtener la posición Y de la tierra profunda (final de la regla)
  const yFin = canvas.height * (proporciones.cielo + proporciones.tierraClara + proporciones.tierraOscura);

  const margenIzquierdo = 40;

  ctx.save();

  // Línea vertical
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margenIzquierdo, yInicio);
  ctx.lineTo(margenIzquierdo, yFin);
  ctx.stroke();

  // Marca superior (0 mts)
  ctx.beginPath();
  ctx.moveTo(margenIzquierdo - 10, yInicio);
  ctx.lineTo(margenIzquierdo + 10, yInicio);
  ctx.stroke();

  // Texto arriba (0 mts)
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('0 mts', margenIzquierdo + 15, yInicio - 5);

  // Marca inferior (Profundidad máxima)
  ctx.beginPath();
  ctx.moveTo(margenIzquierdo - 10, yFin);
  ctx.lineTo(margenIzquierdo + 10, yFin);
  ctx.stroke();

  // Texto abajo (Profundidad máxima)
  ctx.textBaseline = 'top';
  ctx.fillText(`${profundidadMaxima} mts`, margenIzquierdo + 15, yFin - 20);

  ctx.restore();
}

function dibujarExtractor(xCentro, yBase, escala = 1) {
  ctx.save();
  ctx.translate(xCentro, yBase);
  ctx.scale(escala, escala);

  // Base
  ctx.fillStyle = '#333';
  ctx.fillRect(-25, 0, 50, 10); // base horizontal

  // Torre
  ctx.fillStyle = '#444';
  ctx.fillRect(-5, -60, 10, 60); // mástil

  // Brazo
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, -60);      // punta del mástil
  ctx.lineTo(40, -90);     // brazo al frente
  ctx.stroke();

  // Cabezal del extractor
  ctx.fillStyle = '#555';
  ctx.fillRect(35, -95, 20, 10);

  // Biela
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(45, -90);  // parte frontal del cabezal
  ctx.lineTo(45, -40);  // hacia abajo
  ctx.stroke();

  ctx.restore();
}

function dibujarTuberia(xInicio, yInicio, direccion = 'derecha', largo = 100) {
  ctx.save();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(xInicio, yInicio);

  // 🔍 Calcular dónde empieza la tierra profunda
  const yBaseTuberia = canvas.height * (proporciones.cielo + proporciones.cesped);

  const radio = 20;
  const margenInferior = 20;
  const alturaDisponible = canvas.height * (proporciones.tierraClara + proporciones.tierraOscura) - radio - margenInferior;
  const proporcion = Math.min(1, Math.abs(profundidadReal / profundidadMaxima));
  const alturaVertical = alturaDisponible * proporcion;
  const yFinalVertical = yBaseTuberia + alturaVertical;

  // Línea vertical hacia la mitad de la tierra profunda
  ctx.lineTo(xInicio, yFinalVertical);

  // Curva hacia el costado
  const xCurva = direccion === 'derecha' ? xInicio + radio : xInicio - radio;

  ctx.arcTo(
    xInicio, yFinalVertical + radio,
    xCurva, yFinalVertical + radio,
    radio
  );

  // Línea horizontal
  const xFinal = direccion === 'derecha' ? xInicio + largo : xInicio - largo;
  ctx.lineTo(xFinal, yFinalVertical + radio);

  ctx.stroke();
  ctx.restore();

  ctx.stroke();

  // 🔹 Mostrar profundidad (arriba a la izquierda de la línea vertical)
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${profundidadReal} mts`, xInicio - 10, yInicio - 5);

  // 🔹 Mostrar longitud horizontal (abajo al final de la línea horizontal)
  ctx.textAlign = direccion === 'derecha' ? 'left' : 'right';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(`${direccion === 'derecha' ? "+" : "-"}${largo} mts`, xInicio - 10, yFinalVertical);

  ctx.restore();
}

function dibujarPaisaje() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const width = canvas.width;
  const height = canvas.height;

  // Calcular proporciones
  const alturaCielo = height * proporciones.cielo;
  const alturaCesped = height * proporciones.cesped;
  const alturaTierraClara = height * proporciones.tierraClara;
  const alturaTierraOscura = height * proporciones.tierraOscura;

  let y = 0;

  // Cielo
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, y, width, alturaCielo);
  y += alturaCielo;

  // Césped
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, y, width, alturaCesped);
  const yCesped = y; // Guardamos la posición Y del césped
  y += alturaCesped;

  // Tierra clara
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(0, y, width, alturaTierraClara);
  y += alturaTierraClara;

  // Tierra profunda
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, y, width, alturaTierraOscura);

  // Regla
  dibujarReglaAltura();

  // Dibujar el extractor
  const xExtractor = width / 3;
  dibujarExtractor(xExtractor, yCesped, 1);

  // Dibujar tubería desde el extractor
  dibujarTuberia(xExtractor, yCesped, direccionTuberia, largoTuberia);

  document.getElementById('info').textContent = `Profundidad: ${profundidadReal} mts`;
}

// Control de los botones de longitud
document.getElementById('right').addEventListener('click', () => {
  if (direccionTuberia === 'derecha') {
    largoTuberia += movimientoLateral; // Aumentar longitud lateral
  } else {
    largoTuberia -= movimientoLateral; // Aumentar longitud hacia la izquierda
  }
  largoTuberia = Math.max(20, largoTuberia); // Evitar que la longitud sea negativa
  dibujarPaisaje();
});

document.getElementById('left').addEventListener('click', () => {
  if (direccionTuberia === 'derecha') {
    largoTuberia -= movimientoLateral; // Reducir longitud lateral
  } else {
    largoTuberia += movimientoLateral; // Reducir longitud hacia la izquierda
  }
  largoTuberia = Math.max(20, largoTuberia); // Evitar que la longitud sea negativa
  dibujarPaisaje();
});

// Manejar el cambio de dirección con el botón
document.getElementById('direction').addEventListener('click', () => {
  // Cambiar entre 'derecha' e 'izquierda' en cada clic
  direccionTuberia = direccionTuberia === 'derecha' ? 'izquierda' : 'derecha';
  dibujarPaisaje();
});

document.getElementById('up').addEventListener('click', () => {
  profundidadReal = Math.min(0, profundidadReal + movimientoVertical); // no sube más de 0
  dibujarPaisaje();
});

document.getElementById('down').addEventListener('click', () => {
  profundidadReal = Math.max(profundidadMaxima, profundidadReal - movimientoVertical); // no baja más que profundidadMaxima
  dibujarPaisaje();
});

document.getElementById('inputProfMax').addEventListener('input', (event) => {
  profundidadMaxima = parseInt(event.target.value, 10);
  dibujarPaisaje(); // Redibujar el paisaje con el nuevo valor de profundidad máxima
});

document.getElementById('inputMovLateral').addEventListener('input', (e) => {
  movimientoLateral = parseFloat(e.target.value);
});

document.getElementById('inputMovVertical').addEventListener('input', (e) => {
  movimientoVertical = parseFloat(e.target.value);
});

// Redibujar al cambiar el tamaño de la ventana
window.addEventListener('resize', dibujarPaisaje);

// Dibujo inicial
dibujarPaisaje();
