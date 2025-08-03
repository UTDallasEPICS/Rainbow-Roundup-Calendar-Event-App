import { createTransport } from "nodemailer";
import { prisma } from '../utils/prisma';
import { createEventReminderEmail } from '../utils/createEventReminderEmail';
import { resolve } from 'path';
import moment from 'moment-timezone';

const config = useRuntimeConfig();
const logoPath = resolve("public/images/318x146Logo.png");

export async function sendReminderEmails(days: number) {
  const transport = createTransport({
    host: config.smtpHost, 
      port: Number(config.smtpPort),
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
  });
  
  // Set date ranges for queries
  const dayStart : Date = moment.tz("America/Chicago").startOf('day').add(days, 'days').toDate();
  const dayEnd : Date = moment.tz("America/Chicago").endOf('day').add(days, 'days').toDate();

 /*****************************************
  ***    SEND EMAILS TO PEOPLE GOING    ***
  *****************************************/

  // retrieve users signed up for events in N number of days
  const signups = await prisma.signUp.findMany({
    where: {
      Event: {
        startTime: {
          gte: dayStart,
          lte: dayEnd,
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

  if (signups.length === 0) {
    console.log(`[cron] Could not find users signed up for event or events that occur in ${days} days`);
  }
  else {
    console.log(`[cron] Sending reminder emails to users signed up for events occuring on ${dayStart.toDateString()}`);

    for (const user of signups) {
      const eventUrl = config.url + `/event/${user.Event.id}`;
      const emailParams = {
        firstname: user.User.firstname,
        title: user.Event.title,
        datetime: user.Event.startTime,
        description: user.Event.description,
        eventURL: eventUrl,
        daysTill: days,
        attending: true,
      };
      const { subject, html, text } = createEventReminderEmail(emailParams);

      const mailOptions = {
        to: user.User.email,
        from: config.smtpFrom,
        subject: subject,
        text: text,
        html: html,
        attachments: [    // use attachments to ensure logo is displayed in email even in dev
          {
            filename: '318x146Logo.png',
            path: logoPath,
            cid: 'logo',
          },
        ],
      };

      transport.sendMail(mailOptions, (err, info) => { if (err) {
          console.log(`[cron] Error sending email to ${user.email}:`, err);
        }
      });
    }
  }

 /*****************************************
  ***  SEND EMAILS TO PEOPLE NOT GOING  ***
  *****************************************/

  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      startTime: true,
    },
  });

  if (events.length === 0) {
    console.log(`[cron] Could not find events that occur in ${days} days`);
  }
  else {
    console.log(`[cron] Sending reminder emails to users not signed up for events occuring on ${dayStart.toDateString()}`);

    for (const event of events) {
      const usersNotSignedUp = await prisma.user.findMany({
        where: {
          GlobalNotif: true,
          emailVerified: { not: null, },
          SignUps: {
            none: { eventId: event.id, }
          }
        },
        select: {
          firstname: true,
          email: true,
        },
      })

      const eventUrl = config.url + `/event/${event.id}`;
      if (usersNotSignedUp.length === 0) {
        console.log(`[cron] Could not find users not signed up for event: ${event.id}`);
      }
      else {
        for (const user of usersNotSignedUp) {
          const emailParams = {
            firstname: user.firstname,
            title: event.title,
            datetime: event.startTime,
            description: event.description,
            eventURL: eventUrl,
            daysTill: days,
            attending: false,
          };
          const { subject, html, text } = createEventReminderEmail(emailParams);

          const mailOptions = {
            to: user.email,
            from: config.smtpFrom,
            subject: subject,
            text: text,
            html: html,
            attachments: [    // use attachments to ensure logo is displayed in email even in dev
              {
                filename: '318x146Logo.png',
                path: logoPath,
                cid: 'logo',
              },
            ],
          };

          transport.sendMail(mailOptions, (err, info) => { if (err) {
              console.log(`[cron] Error sending email to ${user.email}`, err);
            }
          });
        }
      }
    }
  }
}
