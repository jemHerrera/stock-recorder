import { fetchFinvizScreenerRaw } from "./helpers/fetchFinvizScreenerRaw";
import { extractFinvizTable } from "./helpers/extractFinvizTable";
import { mapStockData } from "./helpers/mapStockData";

async function getScreenerData() {
  const rawHtml = await fetchFinvizScreenerRaw(
    process.env.FINVIZ_SCREENER_FILTER ?? "v=171&f=geo_usa,ta_change_u20"
  );

  const table = extractFinvizTable(rawHtml);

  if (!table) {
    console.error("Failed to extract table.");
    return;
  }

  const stockData = table.map(mapStockData);

  console.log(stockData);
}

getScreenerData();
