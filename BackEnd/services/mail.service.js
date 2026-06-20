// Eliminamos Nodemailer por completo y usamos la API HTTP nativa

const sendVerificationEmail = async (to, code) => {
  const payload = {
    sender: { name: "CityFixer", email: process.env.MAIL_USER }, // Asegúrate de que MAIL_USER sea el correo verificado en Brevo
    to: [{ email: to }],
    subject: "Código de verificación — CityFixer",
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Completá tu registro en CityFixer</h2>
        <p>Ingresá el siguiente código en <strong>CityFixer.com</strong> para completar tu registro. Expira en <strong>10 minutos</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 24px 0;">
          ${code}
        </div>
        <p style="color: #888; font-size: 12px;">Si no solicitaste este código, ignorá este mensaje.</p>
      </div>
    `
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Fallo en la API de correos: ${JSON.stringify(errorData)}`);
  }
};

const sendExternalOtpEmail = async (to, code) => {
  const payload = {
    sender: { name: "CityFixer", email: process.env.MAIL_USER },
    to: [{ email: to }],
    subject: "Código de acceso a datos externos — CityFixer",
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Solicitud de acceso a datos externos</h2>
        <p>Se realizó una solicitud de datos desde Power BI. Para autorizar el acceso, ingresá el siguiente código en el header <strong>x-otp-code</strong> de Power BI. Es válido durante <strong>24 horas</strong> y podés usarlo para actualizar los datos las veces que necesites dentro de ese lapso.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 24px 0;">
          ${code}
        </div>
        <p style="color: #e53e3e; font-size: 13px;"><strong>Si no realizaste esta solicitud, ignorá este mensaje y revisá el acceso a tu cuenta de inmediato.</strong></p>
      </div>
    `
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Fallo en la API de correos: ${JSON.stringify(errorData)}`);
  }
};

module.exports = { sendVerificationEmail, sendExternalOtpEmail };
