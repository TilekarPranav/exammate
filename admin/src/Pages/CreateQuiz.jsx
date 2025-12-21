import React, { useState } from "react";
import axios from "axios";

const CreateQuiz = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [quizData, setQuizData] = useState({
    subject: "",
    title: "",
    timeLimit: 0,
    level: "easy",
    totalQuestions: 1,
    questions: [
      {
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
        questionTime: 40,
      },
    ],
  });

  const [imageFile, setImageFile] = useState(null);

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const questions = [...quizData.questions];

    if (name.startsWith("option")) {
      const optionIndex = Number(name.split("-")[1]);
      questions[index].options[optionIndex] = value;
    } else if (name === "correctOption") {
      questions[index].correctOption = Number(value);
    } else if (name === "questionTime") {
      questions[index].questionTime = Number(value);
    } else {
      questions[index][name] = value;
    }

    setQuizData({
      ...quizData,
      questions,
      totalQuestions: questions.length,
      timeLimit: questions.reduce((sum, q) => sum + q.questionTime, 0),
    });
  };

  const addQuestion = () => {
    setQuizData((prev) => {
      const updatedQuestions = [
        ...prev.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctOption: 0,
          questionTime: 40,
        },
      ];
      return {
        ...prev,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
        timeLimit: updatedQuestions.reduce((sum, q) => sum + q.questionTime, 0),
      };
    });
  };

  const removeQuestion = (index) => {
    const questions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({
      ...quizData,
      questions,
      totalQuestions: questions.length,
      timeLimit: questions.reduce((sum, q) => sum + q.questionTime, 0),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a quiz");
        return;
      }

      const formData = new FormData();
      formData.append("subject", quizData.subject);
      formData.append("title", quizData.title);
      formData.append("timeLimit", quizData.timeLimit);
      formData.append("level", quizData.level);
      formData.append("questions", JSON.stringify(quizData.questions));
      if (imageFile) formData.append("image", imageFile);

      await axios.post(`${API_URL}/api/quiz/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Quiz Created Successfully!");

      setQuizData({
        subject: "",
        title: "",
        timeLimit: 0,
        level: "easy",
        totalQuestions: 1,
        questions: [
          {
            questionText: "",
            options: ["", "", "", ""],
            correctOption: 0,
            questionTime: 40,
          },
        ],
      });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create quiz");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gray-50">
      <h1 className="text-3xl font-bold mb-5 text-indigo-600">Create Quiz</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="subject"
            value={quizData.subject}
            onChange={handleQuizChange}
            placeholder="Subject"
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="title"
            value={quizData.title}
            onChange={handleQuizChange}
            placeholder="Quiz Title"
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            name="timeLimit"
            value={quizData.timeLimit}
            readOnly
            className="p-3 border rounded-lg bg-gray-100"
          />
          <select
            name="level"
            value={quizData.level}
            onChange={handleQuizChange}
            className="p-3 border rounded-lg"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full p-3 border rounded-lg"
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Quiz Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>

        {quizData.questions.map((q, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg">
            <textarea
              name="questionText"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, e)}
              placeholder="Question Text"
              className="w-full p-2 border rounded mb-3"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  name={`option-${i}`}
                  value={opt}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder={`Option ${i + 1}`}
                  className="p-2 border rounded"
                  required
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <input
                type="number"
                name="correctOption"
                value={q.correctOption}
                onChange={(e) => handleQuestionChange(index, e)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                name="questionTime"
                value={q.questionTime}
                onChange={(e) => handleQuestionChange(index, e)}
                className="p-2 border rounded"
                required
              />
            </div>

            {quizData.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="mt-2 text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-lg"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
