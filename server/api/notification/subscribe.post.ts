//import { v, validate } from "~/server/utils/valibot";
import { getServerSession } from "#auth";
import { keys } from "vuetify/lib/util/helpers.mjs";
import { Subscription } from "~/types/Notification";
import { User } from "~/types/session";


export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const session = await getServerSession(event);
  const user = session?.user as User | undefined;
  //const storage = session?.notification as User | undefined;
  const body = await readBody(event);
  const subscription = body as Subscription;
  if (typeof subscription == undefined){
    setResponseStatus(event, 500);
    return { success: false, error: "Please send a valid request"};
  }

  try{
    const newSubscription = await event.context.prisma.notification.create({
      data: {
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      },
    });
    return { success: true, message: "Notification subscription created" };

  }catch (error) {
    console.error((error as Error).message);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: "Couldn't store subscription, try again and hopefully it works",
    };
  }
  //const storage = useStorage("db");

  //await storage.setItem(`subscription:${body.keys.auth}`, body);

  setResponseStatus(event, 201);

  return { success: true };
});
