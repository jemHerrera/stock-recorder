import { Options } from "@mikro-orm/core";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Record } from "./entities/Record";
import "reflect-metadata";

const mikroOrmConfig = {
  entities: [Record],
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  driverOptions: {
    ...(process.env.NODE_ENV === "production" && {
      connection: { ssl: { rejectUnauthorized: false } },
    }),
  },
  migrations: {
    pathTs: "./src/migrations",
  },
};

export default mikroOrmConfig;
