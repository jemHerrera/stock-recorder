import Holidays from "date-holidays";
import { DateTime } from "luxon";

export const isHoliday = (date: DateTime): boolean => {
  const hd = new Holidays("US");
  const easternTime = date.setZone("America/New_York");
  const isoDate = easternTime.toISODate();

  if (!isoDate) throw new Error("Please provide a valid DateTime format.");

  if (hd.isHoliday(isoDate)) {
    return true;
  }

  return false;
};
