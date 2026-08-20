import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  await transporter.sendMail({
    from: `"Red de Apoyo Colombia" <no-reply@redapoyocolombia.co>`,
    to: email,
    subject: "Restablecer contraseña - Red de Apoyo Colombia",
    text: `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace: ${resetUrl}`,
    html: `<p>Has solicitado restablecer tu contraseña.</p>
           <p>Haz clic en el siguiente enlace para continuar:</p>
           <a href="${resetUrl}" style="background-color: #1E3A8A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Restablecer contraseña</a>`,
  });
}

export async function sendVerificationEmail(email: string, verificationUrl: string): Promise<void> {
  await transporter.sendMail({
    from: `"Red de Apoyo Colombia" <no-reply@redapoyocolombia.co>`,
    to: email,
    subject: "Verifica tu email - Red de Apoyo Colombia",
    text: `Haz clic en el siguiente enlace para verificar tu email: ${verificationUrl}`,
    html: `<p>Haz clic en el siguiente enlace para verificar tu email:</p>
           <a href="${verificationUrl}" style="background-color: #1E3A8A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Ver email</a>`,
  });
}