import Quiz from "../models/quiz.model.js";
import QuizResult from "../models/result.model.js";

// Create Quiz
export const Create = async (req, res) => {
  try {
    const { subject, title, timeLimit, level, questions } = req.body;

    if (!questions) {
      return res.status(400).json({ error: "Questions are required" });
    }

    const parsedQuestions =
      typeof questions === "string" ? JSON.parse(questions) : questions;

    const quiz = new Quiz({
      subject,
      title,
      timeLimit,
      level,
      totalQuestions: parsedQuestions.length,
      questions: parsedQuestions,
      image: req.file ? req.file.path : undefined,
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    console.error("Create Quiz Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update Quiz
export const Update = async (req, res) => {
  try {
    const { subject, title, timeLimit, level, questions } = req.body;

    const updateData = { subject, title, timeLimit, level };

    if (questions && questions.length > 0) {
      const parsedQuestions =
        typeof questions === "string" ? JSON.parse(questions) : questions;

      updateData.questions = parsedQuestions;
      updateData.totalQuestions = parsedQuestions.length;
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz updated successfully", quiz });
  } catch (err) {
    console.error("Update Quiz Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Delete Quiz
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

    // Validate answers array
    if (!Array.isArray(answers)) {
      return res
        .status(400)
        .json({ success: false, message: "Answers array is required" });
    }

    // Fetch quiz
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // Ensure answers length matches questions length
    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: `Answers array length (${answers.length}) does not match number of quiz questions (${quiz.questions.length})`,
      });
    }

    // Calculate results
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) correctCount++;
    });

    const total = quiz.questions.length;
    const wrongCount = total - correctCount;
    const percentage = Math.round((correctCount / total) * 100);

    // Save result
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
    const quizzes = await Quiz.find().lean(); // Fetch all quizzes
    res.json({ quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};