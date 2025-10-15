import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import upload from "../middleware/upload.js";
import {
  Create,
  Update,
  Delete,
  Display,
  DisplayByIdForUser,
  SubmitQuiz,
  getUserResults,
  getQuizById,
  getAllQuizzes,
} from "../controllers/quiz.controllers.js";

const router = express.Router();

// Public access
router.get("/result", verifyToken, getUserResults);
router.get("/display", Display);
router.get("/display/:id", DisplayByIdForUser);

// Protected routes
router.post("/create", verifyToken, upload.single("image"), Create);
router.put("/update/:id", verifyToken, validateObjectId("id"), upload.single("image"), Update);
router.delete("/delete/:id", verifyToken, validateObjectId("id"), Delete);
router.get("/all", verifyToken, getAllQuizzes);
router.get("/:id", verifyToken, validateObjectId("id"), getQuizById);

// Submit quiz
router.post("/submit/:id", verifyToken, validateObjectId("id"), SubmitQuiz);

// Get all results of logged-in user

export default router;
