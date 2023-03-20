require("dotenv").config();

module.exports = {
  user: {
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    port: process.env.DB_port,
    database: process.env.DB_database,
    multipleStatements: true,
    dateStrings: process.env.DB_dateStrings,
  },
  sessionstore: {
    host: process.env.DB_host,
    user: process.env.DB_user,
    port: process.env.DB_port,
    password: process.env.DB_password,
    database: process.env.DB_database,
    multipleStatements: true,
    clearExpired: true,
    expiration: 1000 * 60 * 60 * 24 * 30,
  },
  aws: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    signatureVersion: process.env.SIGNATUREVERSION,
    region: process.env.REGION,
  },

  mailstore: {
    mail: process.env.MAIL,
    mailpwd: process.env.MAILPWD,
  },

  google: {
    google_id: process.env.GOOGLE_ID,
    google_secret: process.env.GOOGLE_SECRET,
    google_callback: process.env.GOOGLE_CALLBACK,
  },

  kakao: {
    kakao_id: process.env.KAKAO_ID,
    kakao_callback: process.env.KAKAO_CALLBACK,
  },
};
