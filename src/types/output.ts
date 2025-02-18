export type Output = {
  ticker: string;
  date: Date;
  change_percent: number;
  from_open_percent: number;
  gap: number;
  change_percent_pre: number;
  from_open_percent_pre: number;
  gap_pre: number;
  beta_pre: number;
  atr_pre: number;
  sma20_percent_pre: number;
  sma50_percent_pre: number;
  sma200_percent_pre: number;
  high_52w_percent_pre: number;
  low_52w_percent_pre: number;
  rsi_pre: number;
  price_pre: number;
  volume_pre: number;
};

export type OutputColumns = {
  [K in keyof Output[][number]]: (string | Date | number)[];
};

export function transformToColumns(data: Output[]): OutputColumns {
  return data.reduce((acc, entry) => {
    Object.keys(entry).forEach((key) => {
      const typedKey = key as keyof Output[][number];
      if (!acc[typedKey]) {
        acc[typedKey] = [];
      }
      acc[typedKey].push(entry[typedKey]);
    });
    return acc;
  }, {} as OutputColumns);
}
