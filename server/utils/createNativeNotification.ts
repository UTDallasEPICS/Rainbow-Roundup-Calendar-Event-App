export function createNativeNotification({
    title,
    datetime,
    daysTill,
    attending,
} : {
    title: string,
    datetime: string,
    daysTill: number,
    attending: boolean,
}) : {title: string, message: string} | undefined {

  // THIS FUNCTION USES useRuntimeConfig() SO ONLY CALL IN SERVER ROUTES, HAS TO HAVE A NITRO CONTEXT
  const config = useRuntimeConfig();
  const { date, time } = parseLocalISO(datetime);
  
  if (daysTill <= 0) {
    return undefined;
  }
  const attendingTitle = `${title} is in ${daysTill} days:`;

  const message = attending ?
    `We're excited to see you soon! Just a reminder that ${title} is in ${daysTill} days!!!`
    : 
    `We’ve got ${title} in ${daysTill} — and we’d love for you to come!!!}`;

  return {
    title: attending ? attendingTitle : "Don’t Miss Out on This Upcoming Event!",
    message: message,

  };
}
