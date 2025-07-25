const config = useRuntimeConfig()   // get url through config

export function createEmailMsg(
    firstName: string,
    title: string,
    datetime: string,
    description: string,
    url: string,
    eventUrl: string,
  ) : string {

  const { date, time } = parseLocalISO(datetime);

  return `<!DOCTYPE html>
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
              <div class="greeting"">
                Hi ${firstName},
              </div>

              <!-- Event Info -->
              <div class="event-details">
                We're excited to invite you to a new event hosted by Rainbow Roundup!<br /><br />
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
                <a href="${url}" style="color: #888;">Visit our website</a>
              </div>
            </div>
          </body>
        </html>
    `;
}

// datetime is UTC, converts to CST
function parseLocalISO(datetime: string) : {date: string, time: string} {
  const date = new Date(datetime);

  const options = {
    timeZone: "America/Chicago",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const format = Intl.DateTimeFormat("en-US", options);
  const parts = format.formatToParts(date);
  
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';

  const formattedDate = `${get('month')} ${get('day')}, ${get('year')}`;
  const formattedTime = `${get('hour')}:${get('minute')} ${get('dayPeriod')}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
} 
