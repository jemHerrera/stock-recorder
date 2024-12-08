import { Record as RecordEntity } from "../entities/Record";
import { StockDataSchema } from "../types/StockData";

export function mapStockData(
  data: Record<string, string>
): Omit<RecordEntity, "date" | "consecutiveDays" | "id"> | undefined {
  if (
    !data["Ticker"] ||
    !data["Price"] ||
    !data["Change"] ||
    !data["from Open"] ||
    !data["Gap"] ||
    !data["Volume"]
  )
    return undefined;

  const parsedData = {
    ticker: data["Ticker"],
    beta: parseFloat(data["Beta"]),
    atr: parseFloat(data["ATR"]),
    sma20_percent: parseFloat(data["SMA20"].replace("%", "")),
    sma50_percent: parseFloat(data["SMA50"].replace("%", "")),
    sma200_percent: parseFloat(data["SMA200"].replace("%", "")),
    high_52w_percent: parseFloat(data["52W High"].replace("%", "")),
    low_52w_percent: parseFloat(data["52W Low"].replace("%", "")),
    rsi: parseFloat(data["RSI"]),
    price: parseFloat(data["Price"]),
    change_percent: parseFloat(data["Change"].replace("%", "")),
    from_open_percent: parseFloat(data["from Open"].replace("%", "")),
    gap: parseFloat(data["Gap"].replace("%", "")),
    volume: parseInt(data["Volume"].replace(/,/g, "")),
  };

  const { success } = StockDataSchema.safeParse(parsedData);

  if (success)
    return {
      ticker: parsedData.ticker,
      beta: parsedData.beta.toString(),
      atr: parsedData.atr.toString(),
      sma20_percent: parsedData.sma20_percent.toString(),
      sma50_percent: parsedData.sma50_percent.toString(),
      sma200_percent: parsedData.sma200_percent.toString(),
      high_52w_percent: parsedData.high_52w_percent.toString(),
      low_52w_percent: parsedData.low_52w_percent.toString(),
      rsi: parsedData.rsi.toString(),
      price: parsedData.price.toString(),
      change_percent: parsedData.change_percent.toString(),
      from_open_percent: parsedData.from_open_percent.toString(),
      gap: parsedData.gap.toString(),
      volume: parsedData.volume,
    };
  return undefined;
}
