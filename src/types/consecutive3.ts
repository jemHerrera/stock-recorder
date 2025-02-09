export type Consecutive3 = {
  ticker: string;
  date: Date;
  change_percent_3: number;
  from_open_percent_3: number;
  gap_3: number;
  beta_2: number;
  atr_2: number;
  sma20_percent_2: number;
  sma50_percent_2: number;
  sma200_percent_2: number;
  high_52w_percent_2: number;
  low_52w_percent_2: number;
  rsi_2: number;
  price_2: number;
  change_percent_2: number;
  from_open_percent_2: number;
  gap_2: number;
  volume_2: number;
};

export type Consecutive3Columns = {
  [K in keyof Consecutive3[][number]]: (string | Date | number)[];
};

export function transformToColumns(data: Consecutive3[]): Consecutive3Columns {
  return data.reduce((acc, entry) => {
    Object.keys(entry).forEach((key) => {
      const typedKey = key as keyof Consecutive3[][number];
      if (!acc[typedKey]) {
        acc[typedKey] = [];
      }
      acc[typedKey].push(entry[typedKey]);
    });
    return acc;
  }, {} as Consecutive3Columns);
}
