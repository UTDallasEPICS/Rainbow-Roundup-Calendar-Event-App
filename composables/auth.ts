import { emailOTPClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
    plugins: [
        emailOTPClient()
    ],
    basePath: "/api/auth",
    baseURL: process.env.URL,
});
