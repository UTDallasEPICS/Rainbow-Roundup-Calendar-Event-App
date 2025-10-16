import webpush, { WebPushError, type PushSubscription } from "web-push";
import { getServerSession } from "#auth";
import { User } from "~/types/session";

export default defineEventHandler(async (event) => {
  // TODO: Test this api for tomfoolery. 
  const body = await readBody(event);
  const runtimeConfig = useRuntimeConfig();
  const email = "mailto:noreply@example.com";
  const publicKey = runtimeConfig.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY; // Get keys from env file 
  const privateKey = runtimeConfig.NUXT_PUSH_VAPID_PRIVATE_KEY;
  const prisma = event.context.prisma;
  const session = await getServerSession(event);
  const user = session?.user as User | undefined;
  if (!user) {
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  if (!publicKey || !privateKey) throw new Error("VAPID keys are not set");

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
      if (!(error instanceof WebPushError)) throw error;

      const isGone = error.statusCode === 410;

      if (!isGone) throw error;
      await prisma.notification.deleteMany({ where: { id: id } });
    }
  }

  return { success: true };
});
