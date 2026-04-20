import express from "express";
import dotenv from "dotenv";
import cors from "cors";              // ← add this
import connectDB from "./config/db.js";
import chatRoute from "./routes/chat.js";  // ← add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.use(cors());                          // ← add this
  app.use(express.json());                  // ← add this (parses request body)
  app.use("/api/chat", chatRoute);          // ← add this

  app.listen(PORT, () => {
    console.log(`🚀 F1GPT Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();