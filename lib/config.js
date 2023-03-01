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
};
