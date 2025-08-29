import Redis from "ioredis";

const redis = new Redis();

export const getCache = async <T = any>(key: string): Promise<T | null> => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, value: any, ttlSeconds = 60): Promise<void> => {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

export const deleteCache = async (key: string): Promise<void> => {
    await redis.del(key);
};

export default redis;