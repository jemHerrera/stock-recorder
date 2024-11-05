import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

@Entity({ tableName: "record" })
export class Record {
  @PrimaryKey({ type: "number" })
  id!: number;

  @Property({ type: "string" })
  ticker!: string;

  @Property({ type: "number" })
  beta!: number;

  @Property({ type: "number" })
  atr!: number;

  @Property({ type: "number" })
  sma20_percent!: number;

  @Property({ type: "number" })
  sma50_percent!: number;

  @Property({ type: "number" })
  sma200_percent!: number;

  @Property({ type: "number" })
  high_52w_percent!: number;

  @Property({ type: "number" })
  low_52w_percent!: number;

  @Property({ type: "number" })
  rsi!: number;

  @Property({ type: "number" })
  price!: number;

  @Property({ type: "number" })
  change_percent!: number;

  @Property({ type: "number" })
  from_open_percent!: number;

  @Property({ type: "number" })
  gap!: number;

  @Property({ type: "number" })
  volume!: number;

  @Property({ type: "date" })
  created: Date = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updated: Date = new Date();
}
