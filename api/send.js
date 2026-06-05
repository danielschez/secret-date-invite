export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fecha, hora, actividad, despues } = req.body;

    if (!fecha || !hora || !actividad || !despues) {
      return res.status(400).json({ error: 'Faltan datos' });
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

    // Log para debug (sin exponer keys completas)
    console.log('Sending with service:', process.env.EMAILJS_SERVICE_ID);
    console.log('Template:', process.env.EMAILJS_TEMPLATE_ID);
    console.log('Public key set:', !!process.env.EMAILJS_PUBLIC_KEY);
    console.log('Private key set:', !!process.env.EMAILJS_PRIVATE_KEY);
    console.log('Dest email:', process.env.DEST_EMAIL);

    const payload = {
      service_id:  process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id:     process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email:  process.env.DEST_EMAIL,
        subject:   '💘 ¡Match confirmado! romance.exe iniciado correctamente',
        message:   cuerpo,
        body:      cuerpo,
        fecha,
        hora,
        actividad,
        despues,
        from_name: 'romance.exe',
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('EmailJS response status:', response.status);
    console.log('EmailJS response body:', responseText);

    if (response.ok) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(500).json({ error: responseText });
    }

  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: err.message || 'Error desconocido' });
  }
}
