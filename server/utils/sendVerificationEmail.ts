import { createTransport } from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const siteUrl = process.env.ORIGIN || "http://localhost:3000";

  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${siteUrl}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || "no-reply@example.com",
    to: email,
    subject: "Verify your email address",
    text: `Please verify your email address by clicking the link: ${verificationUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to the Platform!</h2>
        <p>Please confirm your email by clicking the link below. This link will expire in 15 minutes.</p>
        <a href="${verificationUrl}" style="background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          Verify Email
        </a>
        <p>If you did not sign up, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
