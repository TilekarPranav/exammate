import Quiz from "../models/quiz.model.js";
import QuizResult from "../models/result.model.js";
import cloud from "../middleware/cloudinary.js";


export const Create = async (req, res) => {
  try {
    const { subject, title, timeLimit, level, questions } = req.body;

    if (!questions) {
      return res.status(400).json({ message: "Questions are required" });
    }

    const parsedQuestions =
      typeof questions === "string" ? JSON.parse(questions) : questions;

    let imageUrl = null;

    if (image) {
      const upload = await cloud.uploader.upload(image, {
        folder: "quizzes",
      });
      imageUrl = upload.secure_url;
    }

    const quiz = new Quiz({
      subject,
      title,
      timeLimit,
      level,
      totalQuestions: parsedQuestions.length,
      questions: parsedQuestions,
      image: imageUrl,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (err) {
    console.error("Create Quiz Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const Update = async (req, res) => {
  try {
    const { subject, title, timeLimit, level, questions } = req.body;

    const updateData = {
      subject,
      title,
      timeLimit,
      level,
    };

    if (questions) {
      const parsedQuestions =
        typeof questions === "string" ? JSON.parse(questions) : questions;

      updateData.questions = parsedQuestions;
      updateData.totalQuestions = parsedQuestions.length;
    }

    if (image) {
      const upload = await cloud.uploader.upload(image, {
        folder: "quizzes",
      });
      updateData.image = upload.secure_url;
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (err) {
    console.error("Update Quiz Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const Delete = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const Display = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions.correctOption");
    res.json(quizzes);
  } catch (err) {
    console.error("Display Quizzes Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const DisplayByIdForUser = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    quiz.questions = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      questionTime: q.questionTime || 30,
    }));

    res.json(quiz);
  } catch (err) {
    console.error("Display Quiz Error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const SubmitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const quizId = req.params.id;

    if (!Array.isArray(answers)) {
      return res
        .status(400)
        .json({ success: false, message: "Answers array is required" });
    }

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: `Answers array length (${answers.length}) does not match number of quiz questions (${quiz.questions.length})`,
      });
    }

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) correctCount++;
    });

    const total = quiz.questions.length;
    const wrongCount = total - correctCount;
    const percentage = Math.round((correctCount / total) * 100);

    const result = await QuizResult.create({
      user: req.userId,
      quiz: quiz._id,
      answers,
      marks: `${correctCount}/${total}`,
      correct: correctCount,
      wrong: wrongCount,
      level: quiz.level,
      timeSpent: Number(timeSpent) || 0,
      percentage,
    });

    const populated = await QuizResult.findById(result._id).populate(
      "quiz",
      "title subject level"
    );

    res
      .status(200)
      .json({ success: true, message: "Result saved", result: populated });
  } catch (err) {
    console.error("Submit Quiz Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getUserResults = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const results = await QuizResult.find({ user: req.userId })
      .populate("quiz", "title subject level")
      .sort({ createdAt: -1 });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    console.error("Get Quiz Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().lean(); 
    res.json({ quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};