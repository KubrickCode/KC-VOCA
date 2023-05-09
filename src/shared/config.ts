import dotenv from "dotenv";
import { PoolOptions } from "mysql2/promise";
dotenv.config();

export const dbConfig: PoolOptions = {
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  port: Number(process.env.DB_port),
  database: process.env.DB_database,
  multipleStatements: true,
  dateStrings: ["DATE"],
};
