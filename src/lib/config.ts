import dotenv from "dotenv";
dotenv.config();

interface DatabaseConfig {
  host: string | undefined;
  user: string | undefined;
  password: string | undefined;
  port: string | undefined;
  database: string | undefined;
  multipleStatements: boolean;
  dateStrings?: string | undefined;
  clearExpired?: boolean;
  expiration?: number;
}

interface AwsConfig {
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  signatureVersion: string | undefined;
  region: string | undefined;
  k_region: string | undefined;
}

interface GoogleConfig {
  google_id: string | undefined;
  google_secret: string | undefined;
  google_callback: string | undefined;
}

interface KakaoConfig {
  kakao_id: string | undefined;
  kakao_callback: string | undefined;
}

export const user: DatabaseConfig = {
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  port: process.env.DB_port,
  database: process.env.DB_database,
  multipleStatements: true,
  dateStrings: process.env.DB_dateStrings,
};

export const sessionstore: DatabaseConfig = {
  host: process.env.DB_host,
  user: process.env.DB_user,
  port: process.env.DB_port,
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
