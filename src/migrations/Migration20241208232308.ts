import { Migration } from '@mikro-orm/migrations';

export class Migration20241208232308 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "record" drop column "created", drop column "updated";`);

    this.addSql(`alter table "record" add column "date" date not null, add column "consecutive_days" int not null;`);
    this.addSql(`alter table "record" add constraint "record_ticker_volume_change_percent_unique" unique ("ticker", "volume", "change_percent");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "record" drop constraint "record_ticker_volume_change_percent_unique";`);
    this.addSql(`alter table "record" drop column "consecutive_days";`);

    this.addSql(`alter table "record" add column "updated" date not null;`);
    this.addSql(`alter table "record" rename column "date" to "created";`);
  }

}
