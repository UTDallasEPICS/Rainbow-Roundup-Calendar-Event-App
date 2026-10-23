import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import type { auth } from "../server/auth";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(), // this allows us to get the actual user info
        emailOTPClient()
    ],
    basePath: "/api/auth",
    // In Dev, betterauth doesn't seem to process these. In prod and stage, betterauth processes these with no problems. Not sure what the issue is, but that is why we have the http://localhost:3000 fallback
    baseURL: process.env.URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
