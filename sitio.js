// Lista de espera. DESTINO es la dirección que guarda los mails (por ejemplo, una tabla
// de Supabase o un formulario de Formspree). Mientras esté vacía, no se guarda nada y se avisa.
const DESTINO = '';

const form = document.getElementById('formLista');
const mensaje = document.getElementById('mensajeLista');

// Sin destino todavía: no se muestra un formulario que no guarda nada.
if (!DESTINO) {
  form.hidden = true;
  mensaje.textContent = 'La lista de espera abre muy pronto.';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  mensaje.className = 'mensaje';
  if (!DESTINO) {
    mensaje.textContent = 'La lista de espera abre muy pronto. ¡Gracias por el interés!';
    return;
  }
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
