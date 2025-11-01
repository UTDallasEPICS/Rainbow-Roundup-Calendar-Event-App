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
  if (typeof subscription == undefined) {
    setResponseStatus(event, 500);
    console.log("Invalid notification subscribtion")
    return { success: false, error: "Please send a valid request" };
  }
  if (!(user)) { // since we are tying notification subscriptions to specific users, we need the client to be authenticated
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  try {
    const newSubscription = await event.context.prisma.notification.create({
      data: {
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
        userId: user.id
      },
    });
    if (newSubscription) {
      setResponseStatus(event, 201);
      if (!user.NativeNotif) { // if the user's native notification preference is false, set it to true.
        const updateData: any = {}; // Note: this only runs if the users device is currently subscribing to notifications (not those already subscribed)
        updateData.NativeNotif = true;
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        })
      }
      return { success: true, message: "Notification subscription created" };
    }
    else {
      return { success: false, message: "Notification subscription could not be created" }; // shouldn't be triggered
    }

  } catch (error) {
    console.error((error as Error).message);
    setResponseStatus(event, 500);
    console.log("couldn't store subscription");
    return {
      success: false,
      error: "Couldn't store subscription, try again and hopefully it works",
    };
  }
});
