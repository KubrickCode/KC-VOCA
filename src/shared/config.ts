import dotenv from "dotenv";
import { PoolOptions } from "mysql2/promise";
import { StrategyOptions } from "passport-google-oauth20";
import { StrategyOption } from "passport-kakao";
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

export const kakaoConfig: StrategyOption = {
  clientID: process.env.KAKAO_ID as string,
  callbackURL: process.env.KAKAO_CALLBACK as string,
};

export const googleConfig: StrategyOptions = {
  clientID: process.env.GOOGLE_ID as string,
  clientSecret: process.env.GOOGLE_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK as string,
};
