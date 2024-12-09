import { parseFinvizScreener } from "./parseFinvizScreener";
import { Loaded, MikroORM, PopulatePath } from "@mikro-orm/core";
import mikroOrmConfig from "../mikroOrmConfig";
import { Record } from "../entities/Record";
import { getLast4pmET } from "./getLast4pmET";

export async function record(
  filter: string,
  startOffset: number = 1,
  delayMs: number = 5000
) {
  console.log(`Starting ${filter}`);

  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  const last4pm = getLast4pmET();

  let pageOffset = startOffset,
    pageTickers: string[] = [],
    endOfResults = false,
    previousDay = getLast4pmET(new Date(last4pm)),
    previousDayRecords: Loaded<Record, never, PopulatePath.ALL, never>[] = [],
    previousDayCounter = 0;

  while (!previousDayRecords.length) {
    previousDayRecords = await em.find(Record, {
      date: { $eq: previousDay },
    });

    previousDay = getLast4pmET(new Date(previousDay));
    previousDayCounter++;

    if (previousDayCounter === 3) break;
  }

  while (!endOfResults) {
    const entries = await parseFinvizScreener(filter + `&r=${pageOffset}`);
    const tickers = entries?.map((r) => r.ticker) ?? [];

    endOfResults =
      Boolean(tickers.find((entry) => pageTickers.includes(entry))) ||
      tickers.length < 1;

    if (endOfResults) break;

    entries.forEach((row) => {
      const previousDayTicker = previousDayRecords.find(
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
}
