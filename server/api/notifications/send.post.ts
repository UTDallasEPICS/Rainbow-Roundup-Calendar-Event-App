import webpush, { WebPushError, type PushSubscription } from "web-push";
import { getServerSession } from "#auth";
import { Subscription, Notification } from "~/types/Notification";

const NotificationOptionsSchema = v.object({
  badge: v.string(),
  body: v.string(),
  data: v.object({ url: v.string() }),
  dir: v.picklist(["auto", "ltr", "rtl"]),
  icon: v.string(),
  lang: v.string(),
  requireInteraction: v.boolean(),
  silent: v.boolean(),
  tag: v.string(),
});

const BodySchema = v.object({
  ...v.object({ title: v.string() }).entries,
  ...v.partial(NotificationOptionsSchema).entries,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const runtimeConfig = useRuntimeConfig();

  const email = "mailto:noreply@example.com";
  const publicKey = runtimeConfig.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY; // Get keys from env file 
  const privateKey = runtimeConfig.NUXT_PUSH_VAPID_PRIVATE_KEY;
    const prisma = event.context.prisma;
  const session = await getServerSession(event);

  if (!publicKey || !privateKey) throw new Error("VAPID keys are not set");

  webpush.setVapidDetails(email, publicKey, privateKey);

  //const storage = useStorage("db");

  //const keys = await storage.getKeys("subscription");
  const keys = await prisma.notification.findMany();

  for (const key of keys) {
    const subscription = key as PushSubscription;

    if (!subscription) continue;

    try {
      await webpush.sendNotification(subscription, JSON.stringify(body));
    } catch (error) {
      if (!(error instanceof WebPushError)) throw error;

      const isGone = error.statusCode === 410;

      if (!isGone) throw error;

      await storage.removeItem(key);
    }
  }

  return { success: true };
});
