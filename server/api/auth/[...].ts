// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from "#auth";
import Auth0Provider from "next-auth/providers/auth0";

const config = useRuntimeConfig(); // Use runtime config

export default NuxtAuthHandler({
  providers: [
    Auth0Provider.default({
      clientId: config.AUTH0_CLIENT_ID,
      clientSecret: config.AUTH0_CLIENT_SECRET,
      issuer: config.AUTH0_ISSUER,
    }),
  ],
});
