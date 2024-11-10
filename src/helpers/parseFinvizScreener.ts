import { fetchFinvizScreenerRaw } from "./fetchFinvizScreenerRaw";
import { extractFinvizTable } from "./extractFinvizTable";
import { mapStockData } from "./mapStockData";
import { Record } from "../entities/Record";

export async function parseFinvizScreener(filter: string) {
  const rawHtml = await fetchFinvizScreenerRaw(filter);

  if (!rawHtml) return [];

  const table = extractFinvizTable(rawHtml);

  if (!table) {
    console.error("Failed to extract table.");
    return [];
  }

  const stockData = table.map(mapStockData).filter(Boolean) as Record[];

  return stockData;
}
