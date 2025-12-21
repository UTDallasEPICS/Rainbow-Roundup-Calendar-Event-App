import { auth } from '~/server/auth';
// This is just for backwards compatibility so we don't have to refactor a gazillion nuxtauth code, I think
export default defineEventHandler((event) => {
	return auth.handler(toWebRequest(event));
});