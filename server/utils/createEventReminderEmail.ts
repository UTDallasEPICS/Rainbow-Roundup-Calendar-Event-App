import { parseLocalISO } from './parseLocalISO';

export function createEventReminderEmail({
    firstName,
    title,
    datetime,
    description,
    eventUrl,
    daysTill,
    attending,
} : {
    firstName: string,
    title: string,
    datetime: string,
    description: string,
    eventUrl: string,
    daysTill: number,
    attending: boolean,
}) : {subject: string, html: string, text: string} | undefined {

  // THIS FUNCTION USES useRuntimeConfig() SO ONLY CALL IN SERVER ROUTES, HAS TO HAVE A NITRO CONTEXT
  const config = useRuntimeConfig();
  const { date, time } = parseLocalISO(datetime);
  
  if (daysTill <= 0) {
    return undefined;
  }
  const attendingStr = `We're excited to see you soon! Just a reminder that the event you're signed up for is in ${daysTill} days:`;
  const signupStr = `We’ve got something awesome coming up in ${daysTill} — and we’d love for you to be there!`;

  const text = attending ?
    `We're excited to see you soon! Just a reminder that the event you're signed up for is in ${daysTill} days!!!\n\nCome check it out at ${eventUrl}`
    : 
    `We’ve got something awesome coming up in ${daysTill} — and we’d love for you to come!!!\n\nCome check it out at ${eventUrl}`;

  return {
    subject: attending ? "👋 Just a Reminder – Your Upcoming Event with Us!" : "🎉 Don’t Miss Out on This Upcoming Event!",
    text: text,
    html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Event Notification</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fb;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: auto;
                background: #ffffff;
                padding: 20px 30px;
                border-radius: 8px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
                width: 100%;
              }
              .logo{
                height: auto;
              }
              .greeting {
                font-size: 16px;
                margin-bottom: 20px;
              }
              .event-details {
                font-size: 16px;
                margin-bottom: 20px;
                line-height: 1.6;
              }
              .cta-button {
                display: inline-block;
                background-color: #C028B9;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: bold;
                margin-top: 10px;
              }
              .footer {
                font-size: 13px;
                color: #888;
                margin-top: 40px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <img src="cid:logo" alt="Logo" class="logo" />
              </div>

              <!-- Greeting -->
              <div class="greeting">
                Hi ${firstName},
              </div>

              <!-- Event Info -->
              <div class="event-details">
                ${attending ? attendingStr : signupStr }<br /><br />
                📌 <strong>Event:</strong> ${title} <br />
                📅 <strong>Date:</strong> ${date} <br />
                🕒 <strong>Time:</strong> ${time} <br /><br />

                ${description}
              </div>

              <!-- CTA -->
              <div style="text-align: center;">
                <a href="${eventUrl}" class="cta-button" style="color: #ffffff; text-decoration: none;">RSVP Now</a>
              </div>

              <!-- Footer -->
              <div class="footer">
                Sent with 💜 by Rainbow Roundup<br />
                <a href="${config.url}" style="color: #888;">Visit our website</a>
              </div>
            </div>
          </body>
        </html>
    `,
  };
}
