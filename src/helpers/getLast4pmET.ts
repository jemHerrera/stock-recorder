import { DateTime } from "luxon";
import z from "zod";

export function getLast4pmET(from?: Date): string {
  const easternTime = (
    from ? DateTime.fromJSDate(from) : DateTime.now()
  ).setZone("America/New_York");

  // Check if the current time is after 4 PM ET
  const isAfter4 = easternTime.hour > 16;

  // Get the target 4 PM time
  let targetDate = easternTime;

  if (!isAfter4) {
    // If not after 4 PM, move to the previous day
    targetDate = targetDate.minus({ days: 1 });
  }

  // Adjust for specific days (Monday to Friday logic)
  const weekday = targetDate.weekday; // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
  if (weekday === 7) {
    // Sunday -> Go to Friday
    targetDate = targetDate.minus({ days: 2 });
  } else if (weekday === 6) {
    // Saturday -> Go to Friday
    targetDate = targetDate.minus({ days: 1 });
  }

  // Set the time to 4 PM
  const last4pm = targetDate.set({
    hour: 16,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  // Return the ISO string for the calculated 4 PM ET
  return last4pm.toISO() as string;
}
