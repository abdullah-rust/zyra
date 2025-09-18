import redis from "../clients/redisClient";

export async function setOnlineUser(
  userId: string,
  socketId: string
): Promise<true | undefined> {
  try {
    await redis.set(`online:${userId}`, socketId);

    return true;
  } catch (e) {
    console.log("redis error", e);
    return undefined;
  }
}

export async function deleteOnlineUser(id: string) {
  try {
    await redis.del(`online:${id}`);
  } catch (e) {
    console.log("redis error", e);
  }
}

export async function getSocketId(
  userId: string
): Promise<string | null | undefined> {
  try {
    const recipientSocketId = await redis.get(`online:${userId}`);
    return recipientSocketId;
  } catch (e) {
    console.log("redis error", e);
    return undefined;
  }
}
