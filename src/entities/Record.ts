import {
  Entity,
  Property,
  PrimaryKey,
  DecimalType,
  Unique,
} from "@mikro-orm/core";

@Unique({ properties: ["ticker", "volume", "change_percent"] })
@Entity({ tableName: "record" })
export class Record {
  @PrimaryKey({ type: "number" })
  id!: number;

  @Property({ type: "string" })
  ticker!: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  beta?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  atr?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  sma20_percent?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  sma50_percent?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  sma200_percent?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  high_52w_percent?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  low_52w_percent?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2, nullable: true })
  rsi?: string;

  @Property({ type: DecimalType, precision: 10, scale: 2 })
  price!: string;

  @Property({ type: DecimalType, precision: 10, scale: 2 })
  change_percent!: string;

  @Property({ type: DecimalType, precision: 10, scale: 2 })
  from_open_percent!: string;

  @Property({ type: DecimalType, precision: 10, scale: 2 })
  gap!: string;

  @Property({ type: "number" })
  volume!: number;

  @Property({ type: "date" })
  date: Date = new Date();

  @Property({ type: "number" })
  consecutiveDays!: number;
}
