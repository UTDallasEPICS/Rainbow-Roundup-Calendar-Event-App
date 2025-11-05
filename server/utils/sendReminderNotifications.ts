import { prisma } from '../utils/prisma';
import moment from 'moment-timezone';
import webpush, { sendNotification, WebPushError, type PushSubscription } from "web-push";
import { createNativeNotification } from './createNativeNotification';
import { sendNativeNotification } from './sendNotification';
const config = useRuntimeConfig();

export async function sendReminderNotifications(days: number) {
    // Set date ranges for queries
    const dayStart: Date = moment.tz("America/Chicago").startOf('day').add(days, 'days').toDate();
    const dayEnd: Date = moment.tz("America/Chicago").endOf('day').add(days, 'days').toDate();
    const signups = await prisma.signUp.findMany({
        where: {
            Event: {
                startTime: {
                    gte: dayStart,
                    lte: dayEnd,
                },
            },
            User: {
                nativeNotif: true,
                emailVerified: { not: null },
            },
        },
        select: {
            User: {
                select: {
                    email: true,
                    firstname: true,
                    id: true,
                },
            },
            Event: {
                select: {
                    id: true,
                    title: true,
                    startTime: true,
                    description: true,
                },
            },
        },
    });
    if (signups.length === 0) {
        console.log(`[cron] Could not find users signed up for event or events that occur in ${days} days`);
    }
    else {
        console.log(`[cron] Sending reminder notifications to users signed up for events occuring on ${dayStart.toDateString()}`);

        for (const user of signups) {
            const eventUrl = config.url + `/calendar`;
            const notifParams = {
                title: user.Event.title,
                datetime: user.Event.startTime,
                daysTill: days,
                attending: true,
            };
            const { title, message } = createNativeNotification(notifParams);

            sendNativeNotification(title,message,user.User.id,eventUrl);
        }
    }
}