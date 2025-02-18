import { MikroORM } from "@mikro-orm/core";
import fs from "fs";

import mikroOrmConfig from "./mikroOrmConfig";
import { Record } from "./entities/Record";
import { jsonToCsv } from "./helpers/jsonToCsv";
import { Consecutive3, transformToColumns } from "./types/consecutive3";

(async () => {
  console.log("Starting second day down.");
  const timestamp = new Date().getTime();

  const orm = await MikroORM.init(mikroOrmConfig);
  const pLimit = await import("p-limit").then((mod) => mod.default);

  try {
    const em = orm.em.fork();
    const limit = pLimit(20);

    const day3Records = await em.find(Record, { consecutiveDays: 3 });

    const consecutive3Days: Consecutive3[] = (
      await Promise.all(
        day3Records.map(async (day3) => {
          return limit(async () => {
            const [day2, day1] = await em.find(
              Record,
              {
                consecutiveDays: {
                  $in: [2, 1],
                },
                ticker: day3.ticker,
                date: { $lt: day3.date },
              },
              {
                orderBy: {
                  date: "DESC NULLS LAST",
                },
                limit: 2,
              }
            );

            if (
              Number(day2.from_open_percent) > 0 ||
              Number(day2.gap) < 8 ||
              Number(day2.beta) < 0 ||
              Number(day1.change_percent) < 0 ||
              Number(day1.gap) < 8
            )
              return;

            return {
              ticker: day3.ticker,
              date: day3.date,
              change_percent_3: Number(day3.change_percent),
              from_open_percent_3: Number(day3.from_open_percent),
              gap_3: Number(day3.gap),
              change_percent_2: Number(day2.change_percent),
              from_open_percent_2: Number(day2.from_open_percent),
              gap_2: Number(day2.gap),
              beta_2: Number(day2.beta),
              atr_2: Number(day2.atr),
              sma20_percent_2: Number(day2.sma20_percent),
              sma50_percent_2: Number(day2.sma50_percent),
              sma200_percent_2: Number(day2.sma200_percent),
              high_52w_percent_2: Number(day2.high_52w_percent),
              low_52w_percent_2: Number(day2.low_52w_percent),
              rsi_2: Number(day2.rsi),
              price_2: Number(day2.price),
              volume_2: Number(day2.volume),
            };
          });
        })
      )
    ).filter(Boolean) as Consecutive3[];

    const dataSet = transformToColumns(consecutive3Days);

    // const correlations: Partial<Consecutive3Correlations> = {};

    // Object.keys(consecutive3Correlations).forEach((key) => {
    //   const [xKey, yKey] =
    //     consecutive3Correlations[key as keyof typeof consecutive3Correlations];

    //   correlations[key as keyof typeof consecutive3Correlations] =
    //     ss.sampleCorrelation(
    //       dataSet[xKey as keyof typeof dataSet],
    //       dataSet[yKey as keyof typeof dataSet]
    //     );
    // });

    // OUTPUT JSON FILE
    fs.writeFileSync("output.json", JSON.stringify(dataSet, null, 2), "utf-8");

    // OUTPUT CSV FILE
    const csv = jsonToCsv(consecutive3Days);
    fs.writeFileSync("output.csv", csv, "utf-8");

    orm.close();
  } catch (e: any) {
    console.error(`Error in 'inspect': ${JSON.stringify(e)}`);

    if (e.message) {
      console.error(`Error message: ${JSON.stringify(e.message)}`);
    }
    orm.close();
  }

  const ms = new Date().getTime() - timestamp;
  console.log(`Completed second day down in ${ms}ms`);
})();
