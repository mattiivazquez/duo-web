// Marca que hay JavaScript: recién ahí se esconden las cosas que "aparecen".
document.documentElement.classList.add('js');
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

// La barra de arriba marca su borde al bajar.
const barra = document.querySelector('.cab');
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
