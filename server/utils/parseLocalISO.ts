// datetime is UTC, converts to CST
export function parseLocalISO(datetime: string) : {date: string, time: string} {
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
