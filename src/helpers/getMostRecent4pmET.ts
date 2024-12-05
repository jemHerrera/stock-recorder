export function getMostRecent4pmET(): Date {
  const now = new Date();

  // Convert current time to UTC
  const currentUTC = now.getTime();
  const utcOffsetET = -5; // Eastern Time offset in standard time (UTC-5)

  // Determine the current day and time in ET
  const nowET = new Date(currentUTC + utcOffsetET * 60 * 60 * 1000);
  const dayET = nowET.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hourET = nowET.getHours();
  const minuteET = nowET.getMinutes();

  // Calculate the most recent 4:00 PM ET
  let daysToSubtract = 0;
  if (dayET === 0 || dayET === 6) {
    // If it's Saturday or Sunday, set to the most recent Friday
    daysToSubtract = dayET === 0 ? 2 : 1;
  } else if (hourET < 16 || (hourET === 16 && minuteET === 0)) {
    // If it's before 4:00 PM today
    daysToSubtract = 1;
  }

  // Calculate the most recent 4:00 PM ET
  const mostRecent4pmET = new Date(
    currentUTC - daysToSubtract * 24 * 60 * 60 * 1000
  );
  mostRecent4pmET.setUTCHours(21, 0, 0, 0); // 4:00 PM ET is 9:00 PM UTC

  return mostRecent4pmET;
}

// Example usage:
// const recent4pmET = getMostRecent4pmET();
// console.log("Most recent 4:00 PM ET:", recent4pmET);
