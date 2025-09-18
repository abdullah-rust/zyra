import { Request, Response } from "express";
import { verifyAccessToken } from "../../utils/jwt";

export async function Me(req: Request, res: Response): Promise<Response | any> {
  try {
    const accessToken = req.cookies["access_token"];

    if (!accessToken) {
      return res.status(401).json({ loggedIn: false });
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded) return res.status(401).json({ loggedIn: false });

    res.json({ loggedIn: true });
  } catch (e) {
    console.log("Me Error", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
