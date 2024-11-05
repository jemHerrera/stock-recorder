import { StockData } from "../types/StockData";

export function mapStockData(data: Record<string, string>): StockData | null {
  if (
    !data["Ticker"] ||
    !data["Beta"] ||
    !data["ATR"] ||
    !data["SMA20"] ||
    !data["SMA50"] ||
    !data["SMA200"] ||
    !data["52W High"] ||
    !data["52W Low"] ||
    !data["RSI"] ||
    !data["Price"] ||
    !data["Change"] ||
    !data["from Open"] ||
    !data["Gap"] ||
    !data["Volume"]
  )
    return null;

  return {
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
}
