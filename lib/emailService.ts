import { getAllPersonasEmails } from '@/features/employees/actions/employeeRepository';
import { NewsNotificationParams } from '@/interfaces/news-interfaces';
import { Resend } from 'resend';
import { SendEmailParams } from '../interfaces/email-interfaces';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey || resendApiKey.trim() === '') {
  throw new Error(
    'RESEND_API_KEY environment variable is not set or is empty. ' +
      'Please configure a valid API key before using the email service.',
  );
}

const resend = new Resend(resendApiKey);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    await resend.emails.send({
      from: 'Aligo <noreply@notifications.aligo.com.ar>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('[sendEmail] Error sending email via Resend:', {
      to,
      subject,
      error,
    });
    throw error;
  }
}

export async function notifyNewsUpdate({
  titulo,
  tipo,
}: NewsNotificationParams) {
  try {
    const { data: personas, error: emailsError } = await getAllPersonasEmails();

    if (emailsError || !personas || personas.length === 0) {
      console.log('[notifyNewsUpdate] No hay destinatarios');
      return;
    }

    const config = {
      creada: {
        emoji: '🔔',
        accion: 'publicada',
        subject: 'Nueva novedad publicada en Aligo',
        btnColor: '#007bff',
        btnText: 'Ver novedad',
      },
      actualizada: {
        emoji: '🔄',
        accion: 'actualizada',
        subject: 'Novedad actualizada en Aligo',
        btnColor: '#28a745',
        btnText: 'Ver cambios',
      },
    }[tipo];

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];
      try {
        await sendEmail({
          to: persona.email,
          subject: `${config.emoji} ${config.subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <h1 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
                      ${config.emoji} Novedad ${config.accion}
                    </h1>
                    <p style="color: #666; font-size: 16px; margin: 0 0 30px 0;">
                      ¡Hola ${persona.nombre}!
                    </p>
                    <div style="background-color: #f9f9f9; padding: 25px; border-radius: 6px; margin-bottom: 30px;">
                      <h2 style="color: #333; margin: 0 0 10px 0; font-size: 20px;">${titulo}</h2>
                      <p style="color: #666; margin: 0; font-size: 14px;">
                        Ingresá a la plataforma para ver ${tipo === 'creada' ? 'más detalles' : 'los cambios'}.
                      </p>
                    </div>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://aligo.com.ar'}/dashboard/novedades" 
                       style="display: inline-block; background-color: ${config.btnColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      ${config.btnText}
                    </a>
                    <p style="color: #999; font-size: 12px; margin: 40px 0 0 0;">
                      Este es un correo automático. Por favor no responder.
                    </p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });

        if (i < personas.length - 1) {
          await delay(600);
        }
      } catch (error) {
        console.error(
          `[notifyNewsUpdate] Error enviando a ${persona.email}:`,
          error
        );
      }
    }

  } catch (error) {
    console.error('[notifyNewsUpdate] Error en notificaciones:', error);
  }
}
