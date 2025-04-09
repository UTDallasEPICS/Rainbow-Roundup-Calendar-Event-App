// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from "#auth";
import Auth0Provider from "next-auth/providers/auth0";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { createTransport } from "nodemailer";

const config = useRuntimeConfig(); // Use runtime config
const prisma = new PrismaClient();

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // 👈 use JWTs instead of DB sessions
  },
  providers: [
    EmailProvider.default({
      server: {
        host: config.smtpHost,
        port: Number(config.smtpPort),
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
      },
      from: "noreply@example.com",
      sendVerificationRequest({
        identifier: email,
        url,
        provider,
      }: {
        identifier: string;
        url: string;
        provider: { server: string; from: string };
      }) {
        // Extract host from the URL
        const { host } = new URL(url);

        // Create the transport object for sending the email
        const transport = createTransport(provider.server);

        // Mail options for sending the email
        const mailOptions = {
          to: email,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host} using this link: ${url}`,
          html: `<p>Sign in to <strong>${host}</strong> using this link: <a href="${url}">${url}</a></p>`,
        };

        // Send the email
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    async signIn({ user, account, email }) {
      console.log("HELLO THIS IS THE CALLBACK");
      if (!user?.email) {
        // Make sure email exists before proceeding
        return false; // Reject sign-in if no email is present
      }

      const userExists = await prisma.user.findUnique({
        where: { email: user.email }, // Check if the user exists based on email
      });

      if (userExists) {
        return true; // If user exists, allow sign-in
      } else {
        return Promise.resolve("/signup"); // Redirect to register if user does not exist
      }
    },
  },
});
