import nodemailer from 'nodemailer';

export async function sendConfirmationEmail(
  to: string,
  tempPassword: string,
  nombre?: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true', // true para 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <p>Hola ${nombre ?? ''},</p>
    <p>Se creó tu usuario. Tu contraseña temporal es: <strong>${tempPassword}</strong></p>
    <p>Por favor, cambiala al ingresar.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@miapp.com',
    to,
    subject: 'Alta de empleado - credenciales',
    text: `Tu contraseña temporal: ${tempPassword}`,
    html,
  });
}
