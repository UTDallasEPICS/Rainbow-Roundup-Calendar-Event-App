import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import type { auth } from "../server/auth";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(), // this allows us to get the actual user info
        emailOTPClient()
    ],
    basePath: "/api/auth",
    baseURL: process.env.URL,
});
