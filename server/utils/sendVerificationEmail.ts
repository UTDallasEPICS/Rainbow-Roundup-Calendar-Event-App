import { createTransport } from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string, login: boolean) => {
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
    text: `Your otp code is: ${token}`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <h2>Welcome to Rainbow Roundup!</h2>
    <p>Please confirm your email by entering the OTP code below. This code will expire in 5 minutes.</p>
    <p>Your otp code is: <strong>${token}</strong></p>
    `, // The strong tag for the token should bold it and signal it as important to screen readers and such.
  };
  if (login) {
    const mailOptions = {
      // changed to use config.smtpFrom, if no-reply is sending, there is an issue with the email and not the code
      from: config.smtpFrom || "no-reply@example.com",
      to: email,
      subject: "Your login code",
      text: `Your otp code is: ${token}`,
      html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <h2>Sign in to Rainbow Roundup</h2>
    <p>Login using the code below. This code will expire in 5 minutes.</p>
    <p>Your otp code is: <strong>${token}</strong></p>
    `, // The strong tag for the token should bold it and signal it as important to screen readers and such.
    };
    await transporter.sendMail(mailOptions);
  }
  else {
    const mailOptions = {
      // changed to use config.smtpFrom, if no-reply is sending, there is an issue with the email and not the code
      from: config.smtpFrom || "no-reply@example.com",
      to: email,
      subject: "Verify your email address",
      text: `Your otp code is: ${token}`,
      html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
    <h2>Welcome to Rainbow Roundup!</h2>
    <p>Please confirm your email by entering the OTP code below. This code will expire in 5 minutes.</p>
    <p>Your otp code is: <strong>${token}</strong></p>
    `, // The strong tag for the token should bold it and signal it as important to screen readers and such.
    };
    await transporter.sendMail(mailOptions);
  }

};
