import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOption: {
    type: Number,
    required: true,
  },
  questionTime: { 
    type: Number, 
    required: true 
  },
});

const quizSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  timeLimit: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/400x200?text=Quiz+Image",
  },
  questions: [questionSchema],
});

export default mongoose.model("Quiz", quizSchema);
