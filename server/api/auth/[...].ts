// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from "#auth";
import Auth0Provider from "next-auth/providers/auth0";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { createTransport } from "nodemailer";

const config = useRuntimeConfig(); // Access runtime configuration (e.g., SMTP settings)
const prisma = new PrismaClient(); // Initialize Prisma client for database interactions

export default NuxtAuthHandler({
  adapter: PrismaAdapter(prisma), // Use Prisma as the adapter for NuxtAuth
  session: {
    strategy: "jwt", // Use JSON Web Tokens (JWT) for session storage
  },
  providers: [
    EmailProvider.default({
      server: {
        host: config.smtpHost, // SMTP server host
        port: Number(config.smtpPort), // SMTP server port
        auth: {
          user: config.smtpUser, // SMTP username
          pass: config.smtpPass, // SMTP password
        },
      },
      from: "noreply@example.com", // Default sender email address for verification emails
      sendVerificationRequest({
        identifier: email,
        url,
        provider,
      }: {
        identifier: string;
        url: string;
        provider: { server: string; from: string };
      }) {
        // Extract host from the URL to customize the email subject and content
        const { host } = new URL(url);

        // Create the transport object for sending the email using Nodemailer
        const transport = createTransport(provider.server);

        // Mail options for sending the email verification link
        const mailOptions = {
          to: email, // Recipient email address
          from: provider.from, // Sender email address
          subject: `Sign in to ${host}`, // Email subject
          text: `Sign in to ${host} using this link: ${url}`, // Plain text email body
          html: `<p>Sign in to <strong>${host}</strong> using this link: <a href="${url}">${url}</a></p>`, // HTML formatted email body
        };

        // Send the email and log any errors or the success response
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error); // Log error if sending fails
          } else {
            console.log("Email sent:", info.response); // Log success message if email is sent
          }
        });
      },
    }),
  ],
  pages: {
    signIn: "/login", // Custom sign-in page URL
    newUser: "/signup", // Custom sign-up page URL
  },
  callbacks: {
    async signIn({ user, account, email }) {
      // If no email is provided, sign-in should fail
      if (!user?.email) {
        return false;
      }

      try {
        // Check if the user already exists in the database based on their email
        const userExists = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If the user exists, allow sign-in; otherwise, redirect to the sign-up page
        if (userExists) {
          return true;
        } else {
          return Promise.resolve("/signup"); // Redirect to the signup page if user doesn't exist
        }
      } catch (error) {
        console.error("Error checking if user exists:", error); // Log any errors encountered during the sign-in check
        return false; // Prevent sign-in if there is an error
      }
    },
    jwt({ token, account, profile }) {
      // Add the session token to the JWT when account details are available
      if (account) {
        token.sessionToken = account.session_token;
      }
      return token; // Return the updated JWT token
    },
    async session({ session, token }) {
      const email = token.email; // Get the user's email from the JWT token

      if (!email) {
        return session; // If no email is present, return the session as-is
      }

      // Attempt to retrieve additional user data from the database
      try {
        const additionalUserData = await prisma.user.findUnique({
          where: { email },
          select: {
            firstname: true,
            lastname: true,
            phoneNum: true,
            role: true,
          }, // Retrieve only necessary fields
        });

        // If additional user data is found, populate the session with it
        if (additionalUserData) {
          return {
            ...session,
            user: {
              ...session.user,
              firstname: additionalUserData.firstname,
              lastname: additionalUserData.lastname,
              phoneNum: additionalUserData.phoneNum,
              role: additionalUserData.role,
            },
          };
        }

        return session; // If no additional data is found, return the original session
      } catch (error) {
        console.error("Error fetching additional user data:", error); // Log errors encountered while fetching user data
        return session; // Return the original session in case of error
      }
    },
  },
});
