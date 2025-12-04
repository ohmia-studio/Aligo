import nodemailer from 'nodemailer';

export async function sendConfirmationEmail(
  to: string,
  tempPassword: string,
  nombre?: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const appName = process.env.APP_NAME ?? 'Aligo';
  const supportEmail =
    process.env.SUPPORT_EMAIL ?? process.env.SMTP_FROM ?? 'soporte@ejemplo.com';
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Acceso creado</title>
  <style>
    body { margin:0; padding:0; font-family: Arial, sans-serif; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; background-color:#f7f9fc; color:#333; }
    @media (prefers-color-scheme: dark) {
      body { background-color:#071022; color:#e6eef8; }
      .card { background:#071026; }
      .muted { color:#9aa4bf; }
    }
    .wrap{ width:100%; padding:40px 0; }
    .center{ max-width:600px; margin:0 auto; }
    .panel{ background:#ffffff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.08); overflow:hidden; }
    .header{ padding:28px; text-align:center; background:#4a90e2; color:#fff; }
    .header h1{ margin:0; font-size:22px; }
    .body{ padding:28px; font-size:16px; line-height:1.6; }
    .password{ display:block; text-align:center; font-weight:700; font-size:18px; margin:18px 0; background:#f1f6fb; padding:12px 16px; border-radius:6px; }
    .footer{ padding:16px; text-align:center; background:#f0f4f8; font-size:12px; color:#999; }
    a { color:inherit; text-decoration:none; }
    @media (max-width:420px){ .body{ padding:18px } .header{ padding:20px } }
    .muted { color:#666; font-size:14px; }
  </style>
</head>
<body>
  <table class="wrap" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table class="center" width="600" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td class="panel">
              <div class="header" role="img" aria-label="${escapeHtml(appName)}">
                <h1>Bienvenido${nombre ? ', ' + escapeHtml(nombre) : ''} 🎉</h1>
              </div>

              <div class="body">
                <p style="margin:0 0 12px 0;">Tu cuenta en <strong>${escapeHtml(appName)}</strong> fue creada correctamente.</p>

                <p class="muted" style="margin:0 0 8px 0;">Contraseña temporal</p>
                <div class="password">${escapeHtml(tempPassword)}</div>

                <p class="muted" style="margin:0 0 12px 0;">Por seguridad, cambiala al ingresar por primera vez. Si necesitás ayuda contactanos:</p>
                <p style="margin:6px 0 0 0;"><a href="mailto:${escapeHtml(supportEmail)}">${escapeHtml(supportEmail)}</a></p>
              </div>

              <div class="footer">© ${year} ${escapeHtml(appName)}. Todos los derechos reservados.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hola ${nombre ?? ''},

Tu cuenta en ${appName} fue creada correctamente.

Contraseña temporal: ${tempPassword}

Por seguridad, cambiá la contraseña al ingresar por primera vez.
Soporte: ${supportEmail}

© ${year} ${appName}
`;

  const defaultHost = (() => {
    try {
      const u = new URL(process.env.FRONTEND_URL || '');
      return u.host || 'example.com';
    } catch {
      return 'example.com';
    }
  })();

  const fromAddress = process.env.SMTP_FROM ?? `no-reply@${defaultHost}`;

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: `[${appName}] Acceso creado`,
    text,
    html,
  });
}

/** Escapa texto para HTML */
function escapeHtml(str?: string) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
