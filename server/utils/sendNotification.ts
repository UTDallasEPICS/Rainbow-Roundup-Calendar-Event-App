import { prisma } from '../utils/prisma';
import { resolve } from 'path';
import webpush, { WebPushError, type PushSubscription } from "web-push";
import { NotificationBody } from '~/types/Notification';
const config = useRuntimeConfig();
const icon = resolve("public/images//icons/pwa_logo_192.png");
const badge = resolve("public/images//icons/pwa_logo_96.png");
const email = "mailto:noreply@example.com";
const publicKey = config.public.NUXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY; // Get keys from env file 
const privateKey = config.NUXT_PUSH_VAPID_PRIVATE_KEY;

export async function sendNativeNotification(title: string, message: string, userID: string, url: string) {

  const data = { url };
  const body = message;
  const notifications = await prisma.notification.findMany({
    where: {
      userId: userID,
    },
  });
  webpush.setVapidDetails(email, publicKey, privateKey);
  for (const notification of notifications) {

    const auth = notification.auth; // I had to do this because PushSubscription accepts a very specific format, and that is needed to send notifications
    const p256dh = notification.p256dh;
    const id = notification.id;
    const keys = { id, auth, p256dh };
    const endpoint = notification.endpoint;
    const subscription = { endpoint, auth, p256dh, keys } as PushSubscription;
    console.log(message);
    const notificationBody = { title, body, data, icon, badge } as NotificationBody;

    if (!subscription) continue;

    try {
      await webpush.sendNotification(subscription, JSON.stringify(notificationBody));
    } catch (error) {
      console.log(error);
      if (!(error instanceof WebPushError)) {
        throw error; // this means an error not related to sending the notification to the endpoint
      }

      const isGone = error.statusCode === 410; // error 410 is returned when the subscription is expired or "gone", essentially this subscription should never again work
      // Note: we may need to worry about 429, essentially we sent too many requests and are rate limited. 
      // Note: the 50* class of errors are likely temporary, essentially the endpoint server is having an issue, we may want to setup retries
      if (!isGone) {
        throw error; // throw the error if it is an error given by the endpoint, but the subscription itself still exists and might work in future
      }
      else {
        await prisma.notification.deleteMany({ where: { id: id } }); // if the subscription is gone, might as well delete it from db
      }
    }
  }

}