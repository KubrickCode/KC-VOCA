"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsConfig = exports.googleConfig = exports.kakaoConfig = exports.dbConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbConfig = {
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    port: Number(process.env.DB_port),
    database: process.env.DB_database,
    multipleStatements: true,
    dateStrings: ["DATE"],
};
exports.kakaoConfig = {
    clientID: process.env.KAKAO_ID,
    callbackURL: process.env.KAKAO_CALLBACK,
};
exports.googleConfig = {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
};
exports.awsConfig = {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    signatureVersion: process.env.SIGNATUREVERSION,
    region: process.env.REGION,
    k_region: process.env.K_REGION,
};
