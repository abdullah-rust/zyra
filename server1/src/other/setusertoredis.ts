import { Request, Response } from "express";
import pool from "../clients/postgresClient";
import redis from "../clients/redisClient";

export async function setusertoredis(_req: Request, res: Response) {
  try {
    const fetchUsers = await pool.query(
      "SELECT id,name,username,email,bio,img_link FROM users"
    );
    if (fetchUsers.rowCount === 0) {
      return res.send({ message: "no data found on pg" });
    }

    // Promise.all for parallel Redis set
    await Promise.all(
      fetchUsers.rows.map((user) =>
        redis.set(
          `${user.username}`,
          JSON.stringify({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            img_link: user.img_link,
          })
        )
      )
    );

    return res.send({ message: "Users cached in Redis successfully" });
  } catch (e) {
    console.log("db error fetch users", e);
    return res.status(500).json({ message: "internal server Error" });
  }
}

export async function singleSet(user: any) {
  try {
    await redis.set(
      `${user.username}`,
      JSON.stringify({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        img_link: user.img_link,
      })
    );
    return true;
  } catch (e) {
    console.log("set redis error", e);
    return false;
  }
}
