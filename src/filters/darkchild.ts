/* Darkchild: 
Second day open buy
Day 1 gap > -5%
Day 1 from open > -5%
Day 1 beta > 0
Day 1 price > 2
Day 2 gap > 5%
*/
import { MikroORM } from "@mikro-orm/core";
import fs from "fs";

import mikroOrmConfig from "../mikroOrmConfig";
import { Record } from "../entities/Record";
import { jsonToCsv } from "../helpers/jsonToCsv";
import { Output, transformToColumns } from "../types/output";

(async () => {
  console.log("Starting darkchild.");
  const timestamp = new Date().getTime();

  const orm = await MikroORM.init(mikroOrmConfig);
  const pLimit = await import("p-limit").then((mod) => mod.default);

  try {
    const em = orm.em.fork();
    const limit = pLimit(20);

    const day3Records = await em.find(Record, { consecutiveDays: 2 });

    const output: Output[] = (
      await Promise.all(
        day3Records.map(async (day2) => {
          return limit(async () => {
            const [day1] = await em.find(
              Record,
              {
                consecutiveDays: {
                  $in: [1],
                },
                ticker: day2.ticker,
                date: { $lt: day2.date },
              },
              {
                orderBy: {
                  date: "DESC NULLS LAST",
                },
                limit: 1,
              }
            );

            if (
              Number(day1.from_open_percent) < -5 ||
              Number(day1.gap) < -5 ||
              Number(day1.beta) < 0 ||
              Number(day1.price) < 2 ||
              Number(day2.gap) < 1
            )
              return;

            return {
              ticker: day2.ticker,
              date: day2.date,
              change_percent: Number(day2.change_percent),
              from_open_percent: Number(day2.from_open_percent),
              gap: Number(day2.gap),
              change_percent_pre: Number(day1.change_percent),
              from_open_percent_pre: Number(day1.from_open_percent),
              gap_pre: Number(day1.gap),
              beta_pre: Number(day1.beta),
              atr_pre: Number(day1.atr),
              sma20_percent_pre: Number(day1.sma20_percent),
              sma50_percent_pre: Number(day1.sma50_percent),
              sma200_percent_pre: Number(day1.sma200_percent),
              high_52w_percent_pre: Number(day1.high_52w_percent),
              low_52w_percent_pre: Number(day1.low_52w_percent),
              rsi_pre: Number(day1.rsi),
              price_pre: Number(day1.price),
              volume_pre: Number(day1.volume),
            };
          });
        })
      )
    ).filter(Boolean) as Output[];

    const dataSet = transformToColumns(output);

    // OUTPUT JSON FILE
    fs.writeFileSync("output.json", JSON.stringify(dataSet, null, 2), "utf-8");

    // OUTPUT CSV FILE
    const csv = jsonToCsv(output);
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
  console.log(`Completed darkchild in ${ms}ms`);
})();
