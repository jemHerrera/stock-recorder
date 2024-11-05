import z from "zod";

export const StockDataSchema = z.object({
  ticker: z.string(),
  beta: z.number().nullish(),
  atr: z.number().nullish(),
  sma20_percent: z.number().nullish(),
  sma50_percent: z.number().nullish(),
  sma200_percent: z.number().nullish(),
  high_52w_percent: z.number().nullish(),
  low_52w_percent: z.number().nullish(),
  rsi: z.number().nullish(),
  price: z.number(),
  change_percent: z.number(),
  from_open_percent: z.number(),
  gap: z.number(),
  volume: z.number(),
});

export type StockData = z.infer<typeof StockDataSchema>;
