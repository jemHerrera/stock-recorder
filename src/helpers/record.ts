import { parseFinvizScreener } from "./parseFinvizScreener";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "../mikroOrmConfig";
import { Record } from "../entities/Record";

export async function record(
  filter: string,
  startOffset: number = 1,
  delayMs: number = 5000
) {
  console.log(`Starting ${filter}`);

  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  let pageOffset = startOffset;
  let pageTickers: string[] = [];
  let endOfResults = false;

  // TODO: const previousDayRecords get all previous day's records. using 4pmET - 1 day

  while (!endOfResults) {
    const entries = await parseFinvizScreener(filter + `&r=${pageOffset}`);
    const tickers = entries?.map((r) => r.ticker) ?? [];

    // TODO: const isDuplicate : Check if todays' entries are duplicate of the previous day. use array.find

    endOfResults =
      Boolean(tickers.find((entry) => pageTickers.includes(entry))) ||
      tickers.length < 1;

    if (endOfResults) break;

    entries.forEach((row) => {
      // TODO: Check if ticker exists on previous day as well. Add consecutive days +1
      em.create(Record, {
        ...row,
        // date: TODO: Use getMostRecent4pmET, so all time falls at 4pm ET
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
