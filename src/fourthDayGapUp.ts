import { MikroORM } from "@mikro-orm/core";
import fs from "fs";

import mikroOrmConfig from "./mikroOrmConfig";
import { Record } from "./entities/Record";
import { jsonToCsv } from "./helpers/jsonToCsv";
import { Consecutive4, transformToColumns } from "./types/consecutive4";

(async () => {
  console.log("Starting fourth day gap up.");
  const timestamp = new Date().getTime();

  const orm = await MikroORM.init(mikroOrmConfig);
  const pLimit = await import("p-limit").then((mod) => mod.default);

  try {
    const em = orm.em.fork();
    const limit = pLimit(20);

    const day4Records = await em.find(Record, { consecutiveDays: 4 });

    const consecutive4Days: Consecutive4[] = (
      await Promise.all(
        day4Records.map(async (day4) => {
          return limit(async () => {
            const [day3, day2, day1] = await em.find(
              Record,
              {
                consecutiveDays: {
                  $in: [3, 2, 1],
                },
                ticker: day4.ticker,
                date: { $lt: day4.date },
              },
              {
                orderBy: {
                  date: "DESC NULLS LAST",
                },
                limit: 3,
              }
            );

            if (
              Number(day3.change_percent) < 0 ||
              Number(day2.change_percent) < 0 ||
              Number(day1.change_percent) < 0
            )
              return;

            return {
              ticker: day3.ticker,
              date: day3.date,
              change_percent_4: Number(day4.change_percent),
              from_open_percent_4: Number(day4.from_open_percent),
              gap_4: Number(day4.gap),
              change_percent_3: Number(day3.change_percent),
              from_open_percent_3: Number(day3.from_open_percent),
              gap_3: Number(day3.gap),
              beta_3: Number(day3.beta),
              atr_3: Number(day3.atr),
              sma20_percent_3: Number(day3.sma20_percent),
              sma50_percent_3: Number(day3.sma50_percent),
              sma200_percent_3: Number(day3.sma200_percent),
              high_52w_percent_3: Number(day3.high_52w_percent),
              low_52w_percent_3: Number(day3.low_52w_percent),
              rsi_3: Number(day3.rsi),
              price_3: Number(day3.price),
              volume_3: Number(day3.volume),
            };
          });
        })
      )
    ).filter(Boolean) as Consecutive4[];

    const dataSet = transformToColumns(consecutive4Days);

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
    const csv = jsonToCsv(consecutive4Days);
    fs.writeFileSync("output.csv", csv, "utf-8");

    orm.close();

    const timestamp = new Date().getTime();
  } catch (e: any) {
    console.error(`Error in 'inspect': ${JSON.stringify(e)}`);

    if (e.message) {
      console.error(`Error message: ${JSON.stringify(e.message)}`);
    }
    orm.close();
  }

  const ms = new Date().getTime() - timestamp;
  console.log(`Completed fourth day gap up in ${ms}ms`);
})();
