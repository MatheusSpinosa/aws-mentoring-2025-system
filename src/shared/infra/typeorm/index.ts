/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

export const mySQLConnection = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PSWD,
  database: process.env.MYSQL_DATABASE,
  migrations: ["./migrations/**/*.ts"],
  entities: [
    process.env.PRODUCTION != "true"
      ? "./src/modules/**/entities/mysql/*.ts"
      : "./dist/modules/**/entities/mysql/*.js",
  ],
  extra: {
    isolationLevel: "READ COMMITTED",
    idleTimeoutMillis: 30000,
    connectionTimeout: 30000,
    stringifyObjects: true,
    // typeCast(field: any, next: any) {
    //   if (field.type === "JSON") {
    //     return field.string("utf8");
    //   }
    //   return next();
    // },
  },
});
