import * as redis from "redis";
import { promisify } from "util";
import dotenv from "dotenv";
dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  legacyMode: true,
});

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("레디스 연결 완료");
};

if (process.env.NODE_ENV !== "test") {
  connectRedis();
}

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

export const storeRefreshToken = async (
  userId: number,
  refreshToken: string
) => {
  await setAsync(userId, refreshToken);
};

export const getRefreshToken = async (userId: number) => {
  return await getAsync(userId);
};

export const revokeRefreshToken = async (userId: number) => {
  await delAsync(userId);
};
