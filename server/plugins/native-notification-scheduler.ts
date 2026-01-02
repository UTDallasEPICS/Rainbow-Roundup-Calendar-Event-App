import { useScheduler } from '#scheduler';

export default defineNitroPlugin(() => {
  startScheduler();
});

function startScheduler(){
  console.log("[cron] Native notification scheduler starting...");
  const scheduler = useScheduler();

  // set task to run every day at 12pm
  scheduler.run(async () => {
    // the [cron] is not real, Caleb thought it'd look nice to have it
    console.log("[cron] Attempting to send reminder notifications...");
    
    // Sends emails to all users opted into notifications for events occuring 3 and 7 days
    await sendReminderNotifications(3);
    await sendReminderNotifications(7);
    
  }).cron('0 12 * * *', 'America/Chicago');
}
