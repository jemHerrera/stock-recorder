import { fetchFinvizScreenerRaw } from "./helpers/fetchFinvizScreenerRaw";
import { extractFinvizTable } from "./helpers/extractFinvizTable";
import { mapStockData } from "./helpers/mapStockData";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikroOrmConfig";
import { Record } from "./entities/Record";

async function record() {
  const rawHtml = await fetchFinvizScreenerRaw(
    process.env.FINVIZ_SCREENER_FILTER ?? "v=171&f=geo_usa,ta_change_u20"
  );

  const table = extractFinvizTable(rawHtml);

  if (!table) {
    console.error("Failed to extract table.");
    return;
  }

  const stockData = table.map(mapStockData).filter(Boolean) as Record[];

  const orm = await MikroORM.init(mikroOrmConfig);

  const em = orm.em.fork();

  stockData.forEach((row) => {
    em.create(Record, {
      ...row,
      created: new Date(),
      updated: new Date(),
    });
  });

  await em.flush();

  console.log(stockData);
}

record();
