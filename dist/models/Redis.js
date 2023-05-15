"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeRefreshToken = exports.getRefreshToken = exports.storeRefreshToken = exports.connectRedis = exports.redisClient = void 0;
const redis = __importStar(require("redis"));
const util_1 = require("util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
    legacyMode: true,
});
const connectRedis = async () => {
    await exports.redisClient.connect();
    console.log("레디스 연결 완료");
};
exports.connectRedis = connectRedis;
if (process.env.NODE_ENV !== "test") {
    (0, exports.connectRedis)();
}
const getAsync = (0, util_1.promisify)(exports.redisClient.get).bind(exports.redisClient);
const setAsync = (0, util_1.promisify)(exports.redisClient.set).bind(exports.redisClient);
const delAsync = (0, util_1.promisify)(exports.redisClient.del).bind(exports.redisClient);
const storeRefreshToken = async (userId, refreshToken) => {
    await setAsync(userId, refreshToken);
};
exports.storeRefreshToken = storeRefreshToken;
const getRefreshToken = async (userId) => {
    return await getAsync(userId);
};
exports.getRefreshToken = getRefreshToken;
const revokeRefreshToken = async (userId) => {
    await delAsync(userId);
};
exports.revokeRefreshToken = revokeRefreshToken;
