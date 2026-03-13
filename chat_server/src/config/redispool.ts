import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const getRedisConfig = () => ({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    // Retry logic
    return Math.min(times * 50, 2000);
  },
});

let redis: Redis;

export const getRedisClient = (): Redis => {
  if (!redis) {
    redis = new Redis(getRedisConfig());

    redis.on("connect", () => {
      console.log("🔴 [redis]: Connected to Redis successfully");
    });

    redis.on("error", (err) => {
      console.error("❌ [redis]: Redis connection error", err);
    });
  }
  return redis;
};

// Exporting the client directly as well
export const redisClient = getRedisClient();
