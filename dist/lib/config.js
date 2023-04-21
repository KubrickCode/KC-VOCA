"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kakao = exports.google = exports.awsConfig = exports.sessionstore = exports.user = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.user = {
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    port: Number(process.env.DB_port),
    database: process.env.DB_database,
    multipleStatements: true,
    dateStrings: ["DATE"],
};
exports.sessionstore = {
    host: process.env.DB_host,
    user: process.env.DB_user,
    port: Number(process.env.DB_port),
    password: process.env.DB_password,
    database: process.env.DB_database,
    multipleStatements: true,
    clearExpired: true,
    expiration: 1000 * 60 * 60 * 24 * 30,
};
exports.awsConfig = {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    signatureVersion: process.env.SIGNATUREVERSION,
    region: process.env.REGION,
    k_region: process.env.K_REGION,
};
exports.google = {
    google_id: process.env.GOOGLE_ID,
    google_secret: process.env.GOOGLE_SECRET,
    google_callback: process.env.GOOGLE_CALLBACK,
};
exports.kakao = {
    kakao_id: process.env.KAKAO_ID,
    kakao_callback: process.env.KAKAO_CALLBACK,
};
