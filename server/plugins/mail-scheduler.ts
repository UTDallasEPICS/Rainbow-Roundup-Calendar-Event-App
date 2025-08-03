import { useScheduler } from '#scheduler';
import { sendReminderEmails } from '../utils/sendReminderEmails';

export default defineNitroPlugin(() => {
  startScheduler();
});

function startScheduler(){
  console.log("[cron] Email scheduler starting...");
  const scheduler = useScheduler();

  // set task to run every day at 12pm
  scheduler.run(async () => {
    console.log("[cron] Attempting to send reminder emails...");
    
    // Sends emails to all users opted into notifications for events occuring 3 and 7 days
    await sendReminderEmails(3);
    await sendReminderEmails(7);
    
  }).cron('0 12 * * *', 'America/Chicago');
}
