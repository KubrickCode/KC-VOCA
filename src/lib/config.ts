import dotenv from "dotenv";
import { PoolOptions } from "mysql2/promise";
dotenv.config();

type DatabaseConfig = {
  host: string | undefined;
  user: string | undefined;
  password: string | undefined;
  port: number | undefined;
  database: string | undefined;
  multipleStatements: boolean;
  dateStrings?: string | undefined;
  clearExpired?: boolean;
  expiration?: number;
};

type AwsConfig = {
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  signatureVersion: string | undefined;
  region: string | undefined;
  k_region: string | undefined;
};

type GoogleConfig = {
  google_id: string | undefined;
  google_secret: string | undefined;
  google_callback: string | undefined;
};

type KakaoConfig = {
  kakao_id: string | undefined;
  kakao_callback: string | undefined;
};

export const user: PoolOptions = {
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  port: Number(process.env.DB_port),
  database: process.env.DB_database,
  multipleStatements: true,
  dateStrings: ["DATE"],
};

export const sessionstore: DatabaseConfig = {
  host: process.env.DB_host,
  user: process.env.DB_user,
  port: Number(process.env.DB_port),
  password: process.env.DB_password,
  database: process.env.DB_database,
  multipleStatements: true,
  clearExpired: true,
  expiration: 1000 * 60 * 60 * 24 * 30,
};

export const aws: AwsConfig = {
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  signatureVersion: process.env.SIGNATUREVERSION,
  region: process.env.REGION,
  k_region: process.env.K_REGION,
};

export const google: GoogleConfig = {
  google_id: process.env.GOOGLE_ID,
  google_secret: process.env.GOOGLE_SECRET,
  google_callback: process.env.GOOGLE_CALLBACK,
};

export const kakao: KakaoConfig = {
  kakao_id: process.env.KAKAO_ID,
  kakao_callback: process.env.KAKAO_CALLBACK,
};
