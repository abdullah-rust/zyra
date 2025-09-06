import express from "express";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import os from "os";
import cors from "cors";

dotenv.config();
const app = express();

// CORS options
const corsOptions = {
  origin: "http://localhost:3000", // frontend ka origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // cookies, auth headers allow karne ke liye
};

app.use(cors(corsOptions));

const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Zyra Chat API running at http://localhost:${PORT}`);
});

export default app;
