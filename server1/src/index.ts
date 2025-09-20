import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import router from "./routes/route";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = Number(process.env["PORT"] ?? 4000);

// CORS configuration aur doosre middlewares
const devOrigins: string[] = ["http://localhost:5173", "https://zyra.local"];
const prodOrigins: string[] = ["capacitor://localhost"];
const allowedOrigins: string[] = [...devOrigins, ...prodOrigins];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("not alowed banda aay hai ");
      }
    },
    credentials: true,
  })
);

// Doosre middleware yahan aayenge
app.use(cookieParser());
app.use(express.json());

// API routes yahan aayenge
app.get("/", (_req: Request, res: Response) => {
  res.send("chal rha hai ");
});

app.use("/", router);

// ---

// Yeh hai woh ahem hissa. Error-handling middleware hamesha sabse aakhir mein aati hai.
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed by CORS policy.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at 0.0.0.0:${PORT}`);
});

export default app;
