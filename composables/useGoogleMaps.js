// composables/useGoogleMaps.ts (or .js if you're not using TypeScript)
import { Loader } from "@googlemaps/js-api-loader";

export const useGoogleMaps = async () => {
  const config = useRuntimeConfig();

  const loader = new Loader({
    apiKey: config.public.NUXT_GOOGLE_PLACES,
    version: "weekly",
    libraries: ["places"],
  });

  await loader.load();
  return window.google;
};
