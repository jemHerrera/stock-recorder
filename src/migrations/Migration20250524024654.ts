import { Migration } from '@mikro-orm/migrations';

export class Migration20250524024654 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "record" add column "streak_number" int null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "record" drop column "streak_number";`);
  }

}
