import cron from 'node-cron';
import { createTransport } from "nodemailer";
import { prisma } from '../utils/prisma';
import { createEventReminderEmail } from '../utils/createEventReminderEmail';
import { resolve } from 'path';
import moment from 'moment-timezone';

const config = useRuntimeConfig();
const logoPath = resolve("public/images/318x146Logo.png");

export default defineNitroPlugin((nitro) => {
  console.log("[cron] Email scheduler starting...");

  // set task to run every day at 12pm
  const emailTask = cron.schedule('0 12 * * *', () => {
    const transport = createTransport({
      host: config.smtpHost, 
        port: Number(config.smtpPort),
        secure: false,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
    });

    /*
    ***************************************
    ***   EMAILS FOR USERS SIGNED UP    ***
    ***************************************
    */

    // Set date ranges for queries
    const threeDaysStart : Date = moment.tz("America/Chicago").startOf('day').add(3, 'days').toDate();
    const threeDaysEnd : Date = moment.tz("America/Chicago").endOf('day').add(3, 'days').toDate();
    const sevenDaysStart : Date = moment.tz("America/Chicago").startOf('day').add(7, 'days').toDate();
    const sevenDaysEnd : Date = moment.tz("America/Chicago").endOf('day').add(7, 'days').toDate();

    const signupsInThree = await prisma.signUp.findMany({
      where: {
        Event: {
          startTime: {
            gte: threeDaysStart,
            lte: threeDaysEnd,
          },
        },
        User: {
          GlobalNotif: true,
          emailVerified: { not: null },
        },
      },
      select: {
        User: {
          select: {
            email: true,
            firstname: true,
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

    if (signupInThree.length === 0) {
      console.log("[cron] Failed to query signups for events in three days, emails not sent");
    }
    else {
      console.log(`[cron] Sending reminder emails for events occuring on ${threeDaysStart.toDateString()}`);

      for (const user of signupInThree) {
        const eventUrl = config.url + `/event/${user.Event.id}`;
        const emailParams = {
          firstname: user.User.firstname,
          title: user.Event.title,
          datetime: user.Event.startTime,
          description: user.Event.description,
          eventURL: eventUrl,
          daysTill: 3,
          attending: true,
        };
        const { subject, html } = createEventReminderEmail(emailParams);

        const mailOptions = {
          to: user.User.email,
          from: config.smtpFrom,
          subject: subject,
          text: `We're excited to see you soon! Just a reminder that the event you're signed up for is in 3 days!!! \nCome check it out at ${eventUrl}`,
          html: createNewEventEmail(user.firstname, body.title, body.startTime, body.description, eventURL),
          attachments: [    // use attachments to ensure logo is displayed in email even in dev
            {
              filename: '318x146Logo.png',
              path: logoPath,
              cid: 'logo',
            },
          ],
        };

        transport.sendMail(mailOptions, (err, info) => { if (err) {
            console.log(`Error sending email to ${user.email}:`, err);
          }
        });
      }
    }

    const signupsInSeven = await prisma.signUp.findMany({
      where: {
        Event: {
          startTime: {
            gte: sevenDaysStart,
            lte: sevenDaysEnd,
          },
        },
        User: {
          GlobalNotif: true,
          emailVerified: { not: null },
        },
      },
      select: {
        User: {
          select: {
            email: true,
            firstname: true,
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

    if (signupInSeven.length === 0) {
      console.log("[cron] Failed to query signups for events in seven days, emails not sent");
    }
    else {
      console.log(`[cron] Sending reminder emails for events occuring on ${sevenDaysStart.toDateString()}`);

      for (const user of signupInSeven) {
        const eventUrl = config.url + `/event/${user.Event.id}`;
        const emailParams = {
          firstname: user.User.firstname,
          title: user.Event.title,
          datetime: user.Event.startTime,
          description: user.Event.description,
          eventURL: eventUrl,
          daysTill: 7,
          attending: true,
        };
        const { subject, html } = createEventReminderEmail(emailParams);

        const mailOptions = {
          to: user.User.email,
          from: config.smtpFrom,
          subject: subject,
          text: `We're excited to see you soon! Just a reminder that the event you're signed up for is in 7 days!!! \nCome check it out at ${eventUrl}`,
          html: createNewEventEmail(user.firstname, body.title, body.startTime, body.description, eventURL),
          attachments: [    // use attachments to ensure logo is displayed in email even in dev
            {
              filename: '318x146Logo.png',
              path: logoPath,
              cid: 'logo',
            },
          ],
        };

        transport.sendMail(mailOptions, (err, info) => { if (err) {
            console.log(`Error sending email to ${user.email}:`, err);
          }
        });
      }
    }

    /*
    ****************************************
    ***   EMAILS REMINDERS TO SIGN UP    ***
    ****************************************
    */

    const users = 
  }, {name: "event-reminder"});
});
