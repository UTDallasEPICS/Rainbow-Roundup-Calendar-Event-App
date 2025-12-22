import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins"
import { prisma } from './utils/prisma';
import { createAuthClient } from "better-auth/vue"
import { emailOTPClient } from "better-auth/client/plugins"


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
    basePath: "/api/auth",
    pages: {
        signIn: "/login", // Custom sign-in page URL
        newUser: "/signup", // Custom sign-up page URL
    },
    session: { // add a signed 5 minute cookie to user, if it exists and is valid, return session with fewer db calls
        cookieCache: { // this is added because loading session can be slow even on local connection, adding this makes it a bit faster
            enabled: true, // docs on it https://www.better-auth.com/docs/concepts/session-management#session-caching
            maxAge: 5 * 60 // Cache duration in seconds
        }
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
            profilePic: {
                type: 'string',
                required: true,
            },
            nativeNotif: {
                type: 'boolean',
                required: true,
            },
            isArchived: {
                type: 'boolean',
                required: true,
            },
            isBanned: {
                type: 'boolean',
                required: true,
            },
            emailNotif: {
                type: 'boolean',
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
            disableSignUp: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "sign-in") {
                    const user = await prisma.user.findUnique({ // we don't want people banned/archived users to login
                        where: { email: email },
                    });
                    if(!(user?.isArchived || user?.isBanned)){
                        await sendVerificationEmail(email, otp, true);
                    }
                    else{
                        throw new APIError("FORBIDDEN", {
                            message: "Your account is no longer active",
                        });
                    }
                } else if (type === "email-verification") {
                    // Send the OTP for email verification
                    // I'm leaving this code here in case we need it in future, currently we use login for email verfication
                    /*const userExists = await prisma.user.findUnique({ // we don't want people to send emails for users that dont exist
                        where: { email: email },
                    });
                    if (userExists){
                        await sendVerificationEmail(email, otp, false);
                    }*/
                } else {
                    // Send the OTP for password reset, but we dont have that
                }
            },
        })
    ]
});

