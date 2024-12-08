import { Record } from "../entities/Record";

export function serializeRecord(record: Record): string {
  return JSON.stringify({
    ticker: record.ticker,
    beta: record.beta,
    atr: record.atr,
    sma20_percent: record.sma20_percent,
    rsi: record.rsi,
    price: record.price,
    change_percent: record.change_percent,
    from_open_percent: record.from_open_percent,
    gap: record.gap,
    volume: record.volume,
    date: record.date,
    consecutiveDates: record.consecutiveDays,
  });
}
