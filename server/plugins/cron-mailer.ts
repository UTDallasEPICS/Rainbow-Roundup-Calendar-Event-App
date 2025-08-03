import cron from 'node-cron';
import { sendReminderEmails } from '../utils/sendReminderEmails';

export default defineNitroPlugin((nitro) => {
  console.log("[cron] Email scheduler starting...");

  // set task to run every day at 12pm
  const emailTask = cron.schedule('0 12 * * *', async () => {

    console.log("[cron] Attempting to send reminder emails...");
    
    // Sends emails to all users opted into notifications for events occuring 3 and 7 days
    await sendReminderEmails(3);
    await sendReminderEmails(7);
  }, {name: "event-reminder"});
});
