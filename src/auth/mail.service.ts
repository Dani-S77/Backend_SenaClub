import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendVerificationCode(email: string, code: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Tu código de verificación',
      text: `Tu código de verificación es: ${code}`,
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`,
    });
  }

  // AGREGAR ESTOS MÉTODOS:
  async sendPasswordResetEmail(email: string, resetUrl: string, firstName: string): Promise<void> {
    console.log(`Enviando correo de recuperación a: ${email}`);
    await this.mailer.sendMail({
      to: email,
      subject: 'Restablecer Contraseña - SENA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin: 0; font-size: 24px;">Restablecer Contraseña</h1>
            </div>

            <div style="margin-bottom: 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hola ${firstName || 'Usuario'},
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en el sistema SENA.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Haz clic en el botón de abajo para crear una nueva contraseña:
              </p>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Restablecer Contraseña
              </a>
            </div>

            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">Información de Seguridad</h3>
              <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
                <li>Este enlace expira en 15 minutos</li>
                <li>Solo puede ser usado una vez</li>
                <li>Si no solicitaste esto, ignora este correo</li>
              </ul>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Si tienes problemas con el botón, copia este enlace: ${resetUrl}
              </p>
            </div>
          </div>
        </div>
      `,
    });
  }

  async sendPasswordChangedNotification(email: string, firstName: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Contraseña Actualizada - SENA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin: 0; font-size: 24px;">Contraseña Actualizada</h1>
            </div>

            <div style="margin-bottom: 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hola ${firstName || 'Usuario'},
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Tu contraseña ha sido actualizada exitosamente.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Si no realizaste este cambio, contacta al soporte técnico inmediatamente.
              </p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} SENA - Sistema de Gestión Académica
              </p>
            </div>
          </div>
        </div>
      `,
    });
  }

  async sendSimpleTextEmail(email: string, message: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Prueba de correo simple',
      text: message,
    });
  }
}