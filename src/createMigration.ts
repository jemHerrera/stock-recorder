import { MikroORM } from "@mikro-orm/core";

import mikroOrmConfig from "./mikroOrmConfig";

export const createMigration = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  const migrator = orm.getMigrator();
  await migrator.createMigration();

  await orm.close(true);

  console.log("Migration files created!");
};

createMigration();
