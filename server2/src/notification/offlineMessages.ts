import { Request, Response } from "express";
import { getDB } from "../clients/mongodb";

export async function offlineMessages(
  req: Request,
  res: Response
): Promise<any | any> {
  try {
    let user = (req as any).user;
    let username = user.username;

    if (!username) {
      return res.status(400).json({ message: "username not found" });
    }
    let db = await getDB();

    // 5 din pehle ka timestamp
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Collection user ke username ke naam se
    const collection = db.collection(username);

    // Messages jahan read = false aur time_stamp >= 5 din pehle
    const unreadMessages = await collection
      .find({
        read: false,
        time_stamp: { $gte: fiveDaysAgo.toISOString() },
      })
      .toArray();

    // Ab unhi messages ko read: true mark kar do
    if (unreadMessages.length > 0) {
      const ids = unreadMessages.map((msg: any) => msg.message_id);
      await collection.updateMany(
        { message_id: { $in: ids } },
        { $set: { read: true } }
      );
    }

    if (unreadMessages.length > 0) {
      return res.json({ messages: unreadMessages });
    } else {
      res.json({ messages: "messages unread Not found" });
    }
  } catch (e) {
    console.log("offline message send error", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
