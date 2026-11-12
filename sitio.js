// Marca que hay JavaScript: recién ahí se esconden las cosas que "aparecen".
document.documentElement.classList.add('js');
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

// La barra de arriba marca su borde al bajar.
const barra = document.querySelector('.barra');
const alBajar = () => barra.classList.toggle('bajo', scrollY > 8);
addEventListener('scroll', alBajar, { passive: true });
alBajar();

// Aparecer al bajar.
const porAparecer = document.querySelectorAll('[data-aparece]');
if (quieto || !('IntersectionObserver' in window)) {
  porAparecer.forEach((e) => e.classList.add('visto'));
} else {
  const ojo = new IntersectionObserver((vistos) => {
    for (const v of vistos) {
      if (!v.isIntersecting) continue;
      v.target.classList.add('visto');
      ojo.unobserve(v.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  porAparecer.forEach((e) => ojo.observe(e));
}

// Escena de la portada: se escribe el pedido y aparece la respuesta, una sola vez.
const escena = document.querySelector('[data-escena]');
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
async function correrEscena() {
  const caja = escena.querySelector('[data-escribir]');
  const pasos = escena.querySelectorAll('[data-paso]');
  const texto = caja.textContent;
  // El texto que falta queda invisible pero ocupa su lugar: nada salta al escribir.
  const hecho = document.createElement('span');
  hecho.className = 'cursor';
  const resto = document.createElement('span');
  resto.className = 'resto';
  resto.textContent = texto;
  caja.replaceChildren(hecho, resto);
  escena.classList.add('animando');
  await espera(700);
  for (let i = 1; i <= texto.length; i++) {
    hecho.textContent = texto.slice(0, i);
    resto.textContent = texto.slice(i);
    await espera(24);
  }
  hecho.className = '';
  const penso = pasos[0];
  const final = penso.textContent;
  penso.textContent = 'Pensando…';
  penso.classList.add('visto');
  await espera(1300);
  penso.textContent = final;
  for (const p of [...pasos].slice(1)) {
    await espera(420);
    p.classList.add('visto');
  }
}
if (escena && !quieto && 'IntersectionObserver' in window) {
  const ojoEscena = new IntersectionObserver((v) => {
    if (!v[0].isIntersecting) return;
    ojoEscena.disconnect();
    correrEscena();
  }, { threshold: 0.35 });
  ojoEscena.observe(escena);
}

// Lista de espera. DESTINO es la dirección que guarda los mails (por ejemplo, una tabla
// de Supabase o un formulario de Formspree). Mientras esté vacía, el formulario no se muestra.
const DESTINO = '';

const form = document.getElementById('formLista');
const mensaje = document.getElementById('mensajeLista');

if (!DESTINO) {
  form.hidden = true;
  document.getElementById('textoLista').textContent = 'Estamos terminando la versión en la nube.';
  mensaje.className = 'mensaje aviso';
  mensaje.textContent = 'La lista de espera abre muy pronto';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!DESTINO) return;
  const email = form.email.value.trim();
  mensaje.className = 'mensaje';
  const boton = form.querySelector('button');
  boton.disabled = true;
  try {
    const r = await fetch(DESTINO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!r.ok) throw new Error(String(r.status));
    form.reset();
    mensaje.textContent = '¡Listo! Te avisamos apenas abramos.';
  } catch {
    mensaje.className = 'mensaje mal';
    mensaje.textContent = 'No se pudo anotar. Probá de nuevo en un rato.';
  } finally {
    boton.disabled = false;
  }
});
