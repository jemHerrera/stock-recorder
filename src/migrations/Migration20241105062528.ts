import { Migration } from '@mikro-orm/migrations';

export class Migration20241105062528 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "record" ("id" serial primary key, "ticker" varchar(255) not null, "beta" int not null, "atr" int not null, "sma20_percent" int not null, "sma50_percent" int not null, "sma200_percent" int not null, "high_52w_percent" int not null, "low_52w_percent" int not null, "rsi" int not null, "price" int not null, "change_percent" int not null, "from_open_percent" int not null, "gap" int not null, "volume" int not null, "created" date not null, "updated" date not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "record" cascade;`);
  }

}
