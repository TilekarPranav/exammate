import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [{ type: Number }], 
    correct: {
      type: Number,
      default: 0,
    },
    wrong: {
      type: Number,
      default: 0,
    },
    marks: {
      type: String,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number, 
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("QuizResult", quizResultSchema);
