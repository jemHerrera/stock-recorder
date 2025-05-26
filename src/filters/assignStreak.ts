import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "../mikroOrmConfig";
import { Record } from "../entities/Record";

(async () => {
  const timestamp = new Date().getTime();

  const orm = await MikroORM.init(mikroOrmConfig);
  const pLimit = await import("p-limit").then((mod) => mod.default);

  try {
    const em = orm.em.fork();
    const limit = pLimit(20);

    const allRecords = await em.find(Record, {}, { fields: ["ticker"] });

    const uniqueTickers = Array.from(new Set(allRecords.map((r) => r.ticker)));

    await Promise.all(
      uniqueTickers.map(async (r) => {
        return limit(async () => {
          const tickerRecords = await em.find(
            Record,
            { ticker: r, date: { $ne: null } },
            { orderBy: { date: "ASC" } }
          );
          let streak = 1;
          tickerRecords[0].streakNumber = streak;

          for (let i = 1; i < tickerRecords.length; i++) {
            const prev = tickerRecords[i - 1];
            const curr = tickerRecords[i];
            if (curr.consecutiveDays === prev.consecutiveDays + 1) {
              curr.streakNumber = streak;
            } else {
              streak++;
              curr.streakNumber = streak;
            }
          }

          await em.flush();
          console.log(`Processed ${r}`);
        });
      })
    );

    orm.close();
  } catch (e: any) {
    console.error(`Error in 'inspect': ${JSON.stringify(e)}`);

    if (e.message) {
      console.error(`Error message: ${JSON.stringify(e.message)}`);
    }
    orm.close();
  }

  const ms = new Date().getTime() - timestamp;
  console.log(`Completed assignStreak in ${ms}ms`);
})();
