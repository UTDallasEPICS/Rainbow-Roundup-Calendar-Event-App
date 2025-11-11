import { createTransport } from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.ORIGIN || "http://localhost:3000";

  const transporter = createTransport({
    host: config.smtpHost,
    port: parseInt(config.smtpPort || "587"),
    secure: false, 
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  const verificationUrl = `${siteUrl}/verify?token=${token}`;

  const mailOptions = {
    // changed to use config.smtpFrom, if no-reply is sending, there is an issue with the email and not the code
    from: config.smtpFrom || "no-reply@example.com",
    to: email,
    subject: "Verify your email address",
    text: `Please verify your email address by clicking the link: ${verificationUrl}`,
    /*html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to Rainbow Roundup!</h2>
        <p>Please confirm your email by clicking the link below. This link will expire in 10 minutes.</p>
        <a href="${verificationUrl}" style="background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          Verify Email
        </a>
        <p>You can also enter ${token} as your OTP code in the sign up page to com
        <p>If you did not sign up, please ignore this email.</p>
      </div>
    `,*/
    html:`
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <h2>Welcome to Rainbow Roundup!</h2>
    <p>Please confirm your email by entering the OTP code below. This code will expire in 5 minutes.</p>
    <p>Your otp code is: <strong>${token}</strong></p>
    `, // The strong tag for the token should bold it and signal it as important to screen readers and such.
  };
  await transporter.sendMail(mailOptions);
};
