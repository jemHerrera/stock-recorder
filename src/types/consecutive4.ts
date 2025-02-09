export type Consecutive4 = {
  ticker: string;
  date: Date;
  change_percent_4: number;
  from_open_percent_4: number;
  gap_4: number;
  change_percent_all_with_gap: number;
  change_percent_all: number;
  change_percent_3: number;
  from_open_percent_3: number;
  gap_3: number;
  beta_3: number;
  atr_3: number;
  sma20_percent_3: number;
  sma50_percent_3: number;
  sma200_percent_3: number;
  high_52w_percent_3: number;
  low_52w_percent_3: number;
  rsi_3: number;
  price_3: number;
  volume_3: number;
};

export type Consecutive4Columns = {
  [K in keyof Consecutive4[][number]]: (string | Date | number)[];
};

export function transformToColumns(data: Consecutive4[]): Consecutive4Columns {
  return data.reduce((acc, entry) => {
    Object.keys(entry).forEach((key) => {
      const typedKey = key as keyof Consecutive4[][number];
      if (!acc[typedKey]) {
        acc[typedKey] = [];
      }
      acc[typedKey].push(entry[typedKey]);
    });
    return acc;
  }, {} as Consecutive4Columns);
}
