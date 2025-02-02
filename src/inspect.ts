import { MikroORM } from "@mikro-orm/core";
import fs from "fs";
import { Parser } from "json2csv";

import mikroOrmConfig from "./mikroOrmConfig";
import { Record } from "./entities/Record";
import { jsonToCsv } from "./helpers/jsonToCsv";
import ss from "simple-statistics";
import {
  Consecutive3,
  Consecutive3Correlations,
  consecutive3Correlations,
} from "./types/consecutive3";

(async () => {
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

            if (!day2 || !day1) return;

            return {
              change_percent_3: Number(day3.change_percent),
              from_open_percent_3: Number(day3.from_open_percent),
              gap_3: Number(day3.gap),
              beta_2: Number(day2.beta),
              atr_2: Number(day2.atr),
              sma20_percent_2: Number(day2.sma20_percent),
              sma50_percent_2: Number(day2.sma50_percent),
              sma200_percent_2: Number(day2.sma200_percent),
              high_52w_percent_2: Number(day2.high_52w_percent),
              low_52w_percent_2: Number(day2.low_52w_percent),
              rsi_2: Number(day2.rsi),
              price_2: Number(day2.price),
              change_percent_2: Number(day2.change_percent),
              from_open_percent_2: Number(day2.from_open_percent),
              gap_2: Number(day2.gap),
              volume_2: Number(day2.volume),
              beta_1: Number(day1.beta),
              atr_1: Number(day1.atr),
              sma20_percent_1: Number(day1.sma20_percent),
              sma50_percent_1: Number(day1.sma50_percent),
              sma200_percent_1: Number(day1.sma200_percent),
              high_52w_percent_1: Number(day1.high_52w_percent),
              low_52w_percent_1: Number(day1.low_52w_percent),
              rsi_1: Number(day1.rsi),
              price_1: Number(day1.price),
              change_percent_1: Number(day1.change_percent),
              from_open_percent_1: Number(day1.from_open_percent),
              gap_1: Number(day1.gap),
              volume_1: Number(day1.volume),
            };
          });
        })
      )
    ).filter(Boolean) as Consecutive3[];

    const dataSet = consecutive3Days.reduce(
      (a, b) => {
        return {
          change_percent_3: [...a?.change_percent_3, b?.change_percent_3],
          from_open_percent_3: [
            ...a?.from_open_percent_3,
            b?.from_open_percent_3,
          ],
          gap_3: [...a?.gap_3, b?.gap_3],
          beta_2: [...a?.beta_2, b?.beta_2],
          atr_2: [...a?.atr_2, b?.atr_2],
          sma20_percent_2: [...a?.sma20_percent_2, b?.sma20_percent_2],
          sma50_percent_2: [...a?.sma50_percent_2, b?.sma50_percent_2],
          sma200_percent_2: [...a?.sma200_percent_2, b?.sma200_percent_2],
          high_52w_percent_2: [...a?.high_52w_percent_2, b?.high_52w_percent_2],
          low_52w_percent_2: [...a?.low_52w_percent_2, b?.low_52w_percent_2],
          rsi_2: [...a?.rsi_2, b?.rsi_2],
          price_2: [...a?.price_2, b?.price_2],
          change_percent_2: [...a?.change_percent_2, b?.change_percent_2],
          from_open_percent_2: [
            ...a?.from_open_percent_2,
            b?.from_open_percent_2,
          ],
          gap_2: [...a?.gap_2, b?.gap_2],
          volume_2: [...a?.volume_2, b?.volume_2],
          beta_1: [...a?.beta_1, b?.beta_1],
          atr_1: [...a?.atr_1, b?.atr_1],
          sma20_percent_1: [...a?.sma20_percent_1, b?.sma20_percent_1],
          sma50_percent_1: [...a?.sma50_percent_1, b?.sma50_percent_1],
          sma200_percent_1: [...a?.sma200_percent_1, b?.sma200_percent_1],
          high_52w_percent_1: [...a?.high_52w_percent_1, b?.high_52w_percent_1],
          low_52w_percent_1: [...a?.low_52w_percent_1, b?.low_52w_percent_1],
          rsi_1: [...a?.rsi_1, b?.rsi_1],
          price_1: [...a?.price_1, b?.price_1],
          change_percent_1: [...a?.change_percent_1, b?.change_percent_1],
          from_open_percent_1: [
            ...a?.from_open_percent_1,
            b?.from_open_percent_1,
          ],
          gap_1: [...a?.gap_1, b?.gap_1],
          volume_1: [...a?.volume_1, b?.volume_1],
        };
      },
      {
        change_percent_3: [] as number[],
        from_open_percent_3: [] as number[],
        gap_3: [] as number[],
        beta_2: [] as number[],
        atr_2: [] as number[],
        sma20_percent_2: [] as number[],
        sma50_percent_2: [] as number[],
        sma200_percent_2: [] as number[],
        high_52w_percent_2: [] as number[],
        low_52w_percent_2: [] as number[],
        rsi_2: [] as number[],
        price_2: [] as number[],
        change_percent_2: [] as number[],
        from_open_percent_2: [] as number[],
        gap_2: [] as number[],
        volume_2: [] as number[],
        beta_1: [] as number[],
        atr_1: [] as number[],
        sma20_percent_1: [] as number[],
        sma50_percent_1: [] as number[],
        sma200_percent_1: [] as number[],
        high_52w_percent_1: [] as number[],
        low_52w_percent_1: [] as number[],
        rsi_1: [] as number[],
        price_1: [] as number[],
        change_percent_1: [] as number[],
        from_open_percent_1: [] as number[],
        gap_1: [] as number[],
        volume_1: [] as number[],
      }
    );

    const correlations: Partial<Consecutive3Correlations> = {};

    Object.keys(consecutive3Correlations).forEach((key) => {
      const [xKey, yKey] =
        consecutive3Correlations[key as keyof typeof consecutive3Correlations];

      correlations[key as keyof typeof consecutive3Correlations] =
        ss.sampleCorrelation(
          dataSet[xKey as keyof typeof dataSet],
          dataSet[yKey as keyof typeof dataSet]
        );
    });

    // OUTPUT JSON FILE
    fs.writeFileSync(
      "output.json",
      JSON.stringify(correlations, null, 2),
      "utf-8"
    );

    // OUTPUT CSV FILE
    // const csv = jsonToCsv(consecutiveDays);
    // fs.writeFileSync("output.csv", csv, "utf-8");

    orm.close();
  } catch (e: any) {
    console.error(`Error in 'inspect': ${JSON.stringify(e)}`);

    if (e.message) {
      console.error(`Error message: ${JSON.stringify(e.message)}`);
    }
    orm.close();
  }
})();
