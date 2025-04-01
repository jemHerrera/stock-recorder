import { parseFinvizScreener } from "./parseFinvizScreener";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "../mikroOrmConfig";
import { Record } from "../entities/Record";
import { getLast4pmET } from "./getLast4pmET";
import { serializeRecord } from "./serializeRecord";
import { isHoliday } from "./isHoliday";
import { DateTime } from "luxon";

export async function record(
  filter: string,
  startOffset: number = 1,
  delayMs: number = 5000
) {
  const last4pm = getLast4pmET();
  const previousDay = getLast4pmET(new Date(last4pm));

  console.log(`Starting for ${new Date(last4pm).toISOString()}`);

  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  let pageOffset = startOffset;
  let pageTickers: string[] = [];
  let endOfResults = false;

  let previousRecords = await em.find(Record, {
    date: { $eq: previousDay },
  });

  // Handles if previous day is a Holiday
  if (!previousRecords.length && isHoliday(DateTime.fromISO(previousDay))) {
    const dayBeforePreviousDay = getLast4pmET(new Date(previousDay));

    previousRecords = await em.find(Record, {
      date: { $eq: dayBeforePreviousDay },
    });
  }

  while (!endOfResults) {
    const entries = await parseFinvizScreener(filter + `&r=${pageOffset}`);
    const tickers = entries?.map((r) => r.ticker) ?? [];

    const previousDaySet = new Set(previousRecords.map(serializeRecord));

    const hasDuplicate = entries.some((entry) =>
      previousDaySet.has(serializeRecord(entry))
    );

    if (hasDuplicate) {
      console.log("Duplicates found.");
      break;
    }

    endOfResults =
      Boolean(tickers.find((entry) => pageTickers.includes(entry))) ||
      tickers.length < 1;

    if (endOfResults) break;

    entries.forEach((row) => {
      const previousDayTicker = previousRecords.find(
        (record) => record.ticker === row.ticker
      );

      const consecutiveDays = previousDayTicker
        ? previousDayTicker.consecutiveDays + 1
        : 1;

      em.create(Record, {
        ...row,
        date: last4pm,
        consecutiveDays,
      });
    });

    try {
      await em.flush();
    } catch (e) {
      console.log(
        "Error occured in creating record. A duplicate record is possibly being added. "
      );
      break;
    }

    console.log("Offset:", pageOffset, "Length:", tickers.length);

    pageTickers = tickers;
    pageOffset += 20;

    // Wait to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.log(`End of results for ${filter}`);

  orm.close();
}
