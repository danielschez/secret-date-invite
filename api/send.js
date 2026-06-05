import emailjs from '@emailjs/nodejs';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Solo POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { fecha, hora, actividad, despues } = body;

    if (!fecha || !hora || !actividad || !despues) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cuerpo = `💌 CONFIRMACIÓN DE CITA 💌
────────────────────────────────
💖 Respuesta:   Sí, claro que sí
📅 Fecha:       ${fecha}
⏰ Hora:        ${hora}
🌟 Actividad:   ${actividad}
🌙 Después:     ${despues}
────────────────────────────────
✔ romance.exe iniciado correctamente
✔ mariposas en el estómago: activadas
✔ cita agendada exitosamente

Nos vemos pronto, mi enfermera favorita 🏥💕
~ Tu cita confirmada 💕 ~`;

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email:  process.env.DEST_EMAIL,
        subject:   '💘 ¡Match confirmado! romance.exe iniciado correctamente',
        message:   cuerpo,
        body:      cuerpo,
        fecha,
        hora,
        actividad,
        despues,
        from_name: 'romance.exe',
        reply_to:  process.env.DEST_EMAIL,
      },
      {
        publicKey:  process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('EmailJS error:', err);
    return new Response(JSON.stringify({ error: err.text || err.message || 'Error desconocido' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
