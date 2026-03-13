import { redisClient } from "../config/redispool";

/**
 * Redis Utility Service
 * International standard logic for caching JSON data
 */
export const RedisService = {
  /**
   * 1. SET: Data store karne ke liye
   * @param key - Unique string identifier
   * @param data - Any JSON object or array
   * @param ttlInSeconds - (Optional) Time to live in seconds
   */
  set: async (
    key: string,
    data: any,
    ttlInSeconds?: number,
  ): Promise<boolean> => {
    try {
      const value = JSON.stringify(data);

      if (ttlInSeconds && ttlInSeconds > 0) {
        await redisClient.setex(key, ttlInSeconds, value);
      } else {
        await redisClient.set(key, value);
      }
      return true;
    } catch (error) {
      console.error("❌ Redis Set Error:", error);
      return false;
    }
  },

  /**
   * 2. GET: Data mangwane ke liye
   * @param key - The key to retrieve
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await redisClient.get(key);

      if (!data) return null;

      // String ko wapis object (JSON) mein badalna
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("❌ Redis Get Error:", error);
      return null;
    }
  },

  /**
   * 3. DEL: Data delete karne ke liye
   * @param key - The key to remove
   */
  del: async (key: string): Promise<boolean> => {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error("❌ Redis Delete Error:", error);
      return false;
    }
  },

  lpush: async (key: string, data: any): Promise<number | null> => {
    try {
      const value = JSON.stringify(data);
      // lpush queue mein naya data add karta hai aur queue ki nayi length return karta hai
      const result = await redisClient.lpush(key, value);
      return result;
    } catch (error) {
      console.error("❌ Redis LPUSH Error:", error);
      return null;
    }
  },

  rpop: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await redisClient.rpop(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("❌ Redis RPOP Error:", error);
      return null;
    }
  },

  lrange: async <T>(key: string, start: number, stop: number): Promise<T[]> => {
    try {
      const results = await redisClient.lrange(key, start, stop);
      return results.map((item) => JSON.parse(item)) as T[];
    } catch (error) {
      console.error("❌ Redis LRANGE Error:", error);
      return [];
    }
  },
  ltrim: async (key: string, start: number, stop: number): Promise<boolean> => {
    try {
      await redisClient.ltrim(key, start, stop);
      return true;
    } catch (error) {
      console.error("❌ Redis LTRIM Error:", error);
      return false;
    }
  },
};
