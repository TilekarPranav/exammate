import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import quizRouter from "./routes/quiz.route.js";
import adminRouter from "./routes/admin.route.js";
import usersRouter from "./routes/auth.route.js";
import { connectDB } from "./db/connectDB.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

const allowedOrigins = [
  process.env.CLIENT_URL, 
  "http://localhost:5173", 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Allowed Origins: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
