import { emailOTPClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
    //you can pass client configuration here
    plugins: [
        emailOTPClient()
    ],
    basePath: "/api/auth",
    baseURL: process.env.URL,
});

export const useAuthUser = async () => {
	const session = authClient
	return {
		user: (await authClient.useSession(useFetch)).data.value?.user,
	}
}