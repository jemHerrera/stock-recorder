import { Migration } from '@mikro-orm/migrations';

export class Migration20241105071928 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "record" ("id" serial primary key, "ticker" varchar(255) not null, "beta" numeric(10,2) null, "atr" numeric(10,2) null, "sma20_percent" numeric(10,2) null, "sma50_percent" numeric(10,2) null, "sma200_percent" numeric(10,2) null, "high_52w_percent" numeric(10,2) null, "low_52w_percent" numeric(10,2) null, "rsi" numeric(10,2) null, "price" numeric(10,2) not null, "change_percent" numeric(10,2) not null, "from_open_percent" numeric(10,2) not null, "gap" numeric(10,2) not null, "volume" int not null, "created" date not null, "updated" date not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "record" cascade;`);
  }

}
