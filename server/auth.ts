import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins"
import { PrismaClient } from '@prisma/client';
import { createAuthClient } from "better-auth/vue"
import { emailOTPClient } from "better-auth/client/plugins"

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
    basePath: "/api/auth",
    pages: {
        signIn: "/login", // Custom sign-in page URL
        newUser: "/signup", // Custom sign-up page URL
    },
    user: {
        additionalFields: {
            phone: {
                type: 'string',
                required: false,
            },
            firstname: {
                type: 'string',
                required: false,

            },
            lastname: {
                type: 'string',
                required: false,

            },
            role: {
                type: 'string',
                required: true,

            },
        }
    },
    callbacks: {
        async signIn({ user, account, email }) { // todo: understand if account and email need ot be cut
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
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "sign-in") {
                    await sendVerificationEmail(email, otp, true);
                } else if (type === "email-verification") {
                    // Send the OTP for email verification
                    const userExists = await prisma.user.findUnique({ // we don't want people to send emails for users that dont exist
                        where: { email: email },
                    });
                    if (userExists){
                        await sendVerificationEmail(email, otp, false);
                    }
                } else {
                    // Send the OTP for password reset, but we dont have that
                }
            },
        })
    ]
});
export const authClient = createAuthClient({
    //you can pass client configuration here
    plugins: [
        emailOTPClient()
    ],
    user: {
        additionalFields: {
            phone: {
                type: 'string',
                required: false,
            },
            firstname: {
                type: 'string',
                required: false,

            },
            lastname: {
                type: 'string',
                required: false,

            },
            role: {
                type: 'string',
                required: true,

            },
        }
    },
    basePath: "/api/auth",
    baseURL: process.env.URL,
});