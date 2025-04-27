/* Darkchild: 
Second day open buy
Day 0 gap < 2%
Day 0 from open < 2%
Day 1 gap > 5%
Day 1 from open > 5%
*/
import { Loaded, MikroORM } from "@mikro-orm/core";
import fs from "fs";

import mikroOrmConfig from "../mikroOrmConfig";
import { Record } from "../entities/Record";
import { jsonToCsv } from "../helpers/jsonToCsv";
import { Output, transformToColumns } from "../types/output";
import { query1 } from "../queries/query1";

(async () => {
  console.log("Starting darkchild.");
  const timestamp = new Date().getTime();

  const orm = await MikroORM.init(mikroOrmConfig);
  const pLimit = await import("p-limit").then((mod) => mod.default);

  try {
    const em = orm.em.fork();
    const limit = pLimit(20);

    const records = await em.getConnection().execute(query1);

    const nextDayRecords = (
      await Promise.all(
        records.map(async (r) => {
          return limit(async () => {
            const record = await em.findOne(Record, {
              ticker: r.ticker,
              consecutiveDays: r.consecutive_days + 1,
            });
            if (!record) return;

            return {
              ticker: record.ticker,
              date: record.date,
              change_percent: Number(record.change_percent),
              from_open_percent: Number(record.from_open_percent),
              gap: Number(record.gap),
              change_percent_pre: Number(r.change_percent),
              from_open_percent_pre: Number(r.from_open_percent),
              gap_pre: Number(r.gap),
              beta_pre: Number(r.beta),
              atr_pre: Number(r.atr),
              sma20_percent_pre: Number(r.sma20_percent),
              sma50_percent_pre: Number(r.sma50_percent),
              sma200_percent_pre: Number(r.sma200_percent),
              high_52w_percent_pre: Number(r.high_52w_percent),
              low_52w_percent_pre: Number(r.low_52w_percent),
              rsi_pre: Number(r.rsi),
              price_pre: Number(r.price),
              volume_pre: Number(r.volume),
            };
          });
        })
      )
    ).filter(Boolean) as Output[];

    const dataSet = transformToColumns(nextDayRecords);

    // OUTPUT JSON FILE
    fs.writeFileSync("output.json", JSON.stringify(dataSet, null, 2), "utf-8");

    // OUTPUT CSV FILE
    const csv = jsonToCsv(nextDayRecords);
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
