import { parseFinvizScreener } from "./parseFinvizScreener";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "../mikroOrmConfig";
import { Record } from "../entities/Record";
import { getLast4pmET } from "./getLast4pmET";
import { isHoliday } from "./isHoliday";
import { DateTime } from "luxon";

export async function record(
  filter: string,
  startOffset: number = 0,
  delayMs: number = 5000
) {
  const last4pm = getLast4pmET();
  const previousDay = getLast4pmET(new Date(last4pm));

  console.log(`Starting for ${new Date(last4pm).toDateString()}`);

  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  let pageOffset = startOffset;
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
    let successCount = 0;

    for (const row of entries) {
      const previousDayTicker = previousRecords.find(
        (record) => record.ticker === row.ticker
      );

      const consecutiveDays = previousDayTicker
        ? previousDayTicker.consecutiveDays + 1
        : 1;

      const lastRecord = await em.findOne(
        Record,
        { ticker: row.ticker },
        { orderBy: { date: "DESC_NULLS_LAST" } }
      );

      const streakNumber =
        consecutiveDays === 1
          ? lastRecord?.streakNumber
            ? lastRecord?.streakNumber + 1
            : 1
          : (previousDayTicker?.streakNumber as number);

      em.create(Record, {
        ...row,
        date: last4pm,
        consecutiveDays,
        streakNumber,
      });

      try {
        await em.flush();

        console.log(`Saved ${row.ticker}`);
        successCount++;
      } catch (e) {
        console.log(
          `Error occured for ${row.ticker}. A duplicate record is possibly being added.`
        );
      }
    }

    const endOfResults = successCount === 0;
    if (endOfResults) break;

    console.log("Offset:", pageOffset, "Length:", tickers.length);

    pageOffset += 20;

    // Wait to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.log(`End of results for ${new Date(last4pm).toDateString()}`);

  orm.close();
}
