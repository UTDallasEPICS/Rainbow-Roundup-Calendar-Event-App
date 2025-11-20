import webpush, { WebPushError, type PushSubscription } from "web-push";
import { auth } from "~/server/auth"
import { User } from "~/types/session";

export default defineEventHandler(async (event) => {
  // TODO: Test this api for tomfoolery. 
  const body = await readBody(event);
  const runtimeConfig = useRuntimeConfig();
  const email = "mailto:noreply@example.com";
  const publicKey = runtimeConfig.public.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY; // Get keys from env file 
  const privateKey = runtimeConfig.NUXT_PUSH_VAPID_PRIVATE_KEY;
  const prisma = event.context.prisma;
  const session = await auth.api.getSession({
      headers:  event.headers
  })
  const user = session?.user as User | undefined;
  if (!(user?.role === "SUPER" || user?.role ==="ADMIN")) { // since this sends to all users, only admins can do it
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  if (!publicKey || !privateKey) throw new Error("VAPID keys are not set"); // You probably don't have the correct .env file if this error shows up.

  webpush.setVapidDetails(email, publicKey, privateKey);
  const notifications = await prisma.notification.findMany();

  for (const notification of notifications) {

    const auth = notification.auth; // I had to do this because PushSubscription accepts a very specific format, and that is needed to send notifications
    const p256dh = notification.p256dh;
    const id = notification.id;
    const keys = { id, auth, p256dh };
    const endpoint = notification.endpoint;
    const subscription = { endpoint, auth, p256dh, keys } as PushSubscription;

    if (!subscription) continue;

    try {
      await webpush.sendNotification(subscription, JSON.stringify(body));
    } catch (error) {
      if (!(error instanceof WebPushError)) {
        throw error; // this means an error not related to sending the notification to the endpoint
      }

      const isGone = error.statusCode === 410; // error 410 is returned when the subscription is expired or "gone", essentially this subscription should never again work
      // Note: we may need to worry about 429, essentially we sent too many requests and are rate limited. 
      // Note: the 50* class of errors are likely temporary, essentially the endpoint server is having an issue, we may want to setup retries
      if (!isGone) {
        throw error; // throw the error if it is an error given by the endpoint, but the subscription itself still exists and might work in future
      }
      else{
        await prisma.notification.deleteMany({ where: { id: id } }); // if the subscription is gone, might as well delete it from db
      }
    }
  }

  return { success: true };
});
