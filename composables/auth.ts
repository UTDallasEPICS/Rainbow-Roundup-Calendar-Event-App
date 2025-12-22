import { emailOTPClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export const authClient = () => {
    
	return createAuthClient({
		plugins: [
            emailOTPClient()
        ],
		basePath: "/api/auth",
    	baseURL: process.env.URL,
	})
}

export const useAuthUser = async () => {
	const session = authClient()
	return {
		user: (await session.useSession(useFetch)).data.value?.user,
	}
}