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

  let pageOffset = startOffset;
  let pageTickers: string[] = [];
  let endOfResults = false;

  while (!endOfResults) {
    const entries = await parseFinvizScreener(filter + `&r=${pageOffset}`);
    const tickers = entries?.map((r) => r.ticker) ?? [];

    endOfResults =
      Boolean(tickers.find((entry) => pageTickers.includes(entry))) ||
      tickers.length < 1;

    if (endOfResults) break;

    const orm = await MikroORM.init(mikroOrmConfig);
    const em = orm.em.fork();

    entries.forEach((row) => {
      em.create(Record, {
        ...row,
        created: new Date(),
        updated: new Date(),
      });
    });

    await em.flush();

    console.log("Offset:", pageOffset, "Length:", tickers.length);

    pageTickers = tickers;
    pageOffset += 20;

    // Wait to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.log(`End of results for ${filter}`);
}
