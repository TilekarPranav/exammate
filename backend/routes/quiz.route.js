import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
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

router.get("/display", Display);
router.get("/display/:id", DisplayByIdForUser);

router.get("/result", verifyToken, getUserResults);
router.post("/submit/:id", verifyToken, validateObjectId("id"), SubmitQuiz);

router.post("/create", verifyToken, Create);
router.put("/update/:id", verifyToken, validateObjectId("id"), Update);
router.delete("/delete/:id", verifyToken, validateObjectId("id"), Delete);
router.get("/all", verifyToken, getAllQuizzes);
router.get("/:id", verifyToken, validateObjectId("id"), getQuizById);

export default router;
