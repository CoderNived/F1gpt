import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoute from "./routes/chat.js";

dotenv.config();
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY); // ← debug line

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.use(cors());
  app.use(express.json());

  app.use("/api/chat", chatRoute);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "F1GPT server is running" });
  });

  app.listen(PORT, () => {
    console.log(`🚀 F1GPT Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();