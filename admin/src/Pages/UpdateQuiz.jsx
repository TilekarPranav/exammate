import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateQuiz = () => {

  const URL = import.meta.env.VITE_ADMIN_URL || "http://localhost:5000";

  const [quizId, setQuizId] = useState("");
  const [quizData, setQuizData] = useState({
    subject: "",
    title: "",
    timeLimit: 0,
    level: "easy",
    totalQuestions: 1,
    questions: [
      { questionText: "", options: ["", "", "", ""], correctOption: 0, questionTime: 40 },
    ],
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const fetchQuiz = async () => {
    if (!quizId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${URL}/api/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      setQuizData({
        subject: data.subject || "",
        title: data.title || "",
        timeLimit: data.timeLimit || 0,
        level: data.level || "easy",
        totalQuestions: data.questions?.length || 1,
        questions:
          data.questions?.map((q) => ({
            questionText: q.questionText || "",
            options: q.options || ["", "", "", ""],
            correctOption: q.correctOption || 0,
            questionTime: q.questionTime || 40,
          })) || [
            { questionText: "", options: ["", "", "", ""], correctOption: 0, questionTime: 40 },
          ],
      });

      setExistingImage(data.image || null); 
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Quiz not found");
    }
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const questions = [...quizData.questions];

    if (name.startsWith("option")) {
      const optionIndex = parseInt(name.split("-")[1]);
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
        { questionText: "", options: ["", "", "", ""], correctOption: 0, questionTime: 40 },
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
    if (!quizId) {
      alert("Enter Quiz ID to update");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("subject", quizData.subject);
      formData.append("title", quizData.title);
      formData.append("timeLimit", quizData.timeLimit);
      formData.append("level", quizData.level);
      formData.append("questions", JSON.stringify(quizData.questions));
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.put(
        `${URL}/api/quiz/update/${quizId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );

      alert("Quiz Updated Successfully!");
      console.log(res.data);
      setExistingImage(res.data.quiz.image || null);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update quiz");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gray-50">
      <h1 className="text-3xl font-bold mb-5 text-indigo-600">Update Quiz</h1>
      <div className="w-full max-w-4xl space-y-4">
        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="button"
          onClick={fetchQuiz}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Load Quiz
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg space-y-6 mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="subject"
            value={quizData.subject}
            onChange={handleQuizChange}
            placeholder="Subject"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="text"
            name="title"
            value={quizData.title}
            onChange={handleQuizChange}
            placeholder="Quiz Title"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="number"
            name="timeLimit"
            value={quizData.timeLimit}
            readOnly
            placeholder="Total Time (seconds)"
            className="p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
          <select
            name="level"
            value={quizData.level}
            onChange={handleQuizChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Quiz Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg shadow"
            />
          ) : (
            existingImage && (
              <img
                src={existingImage}
                alt="Existing Quiz"
                className="mt-3 w-full h-48 object-cover rounded-lg shadow"
              />
            )
          )}
        </div>

        <div className="space-y-4">
          {quizData.questions.map((q, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-5 rounded-xl shadow-md relative transition transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold mb-3">Question {index + 1}</h2>
              <textarea
                name="questionText"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder="Question Text"
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {q.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    name={`option-${optIndex}`}
                    value={option}
                    onChange={(e) => handleQuestionChange(index, e)}
                    placeholder={`Option ${optIndex + 1}`}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="number"
                  min={0}
                  max={q.options.length - 1}
                  name="correctOption"
                  value={q.correctOption}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder="Correct Option Index (0-3)"
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
                  required
                />
                <input
                  type="number"
                  min={5}
                  max={600}
                  name="questionTime"
                  value={q.questionTime}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder="Time per Question (seconds)"
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
                  required
                />
              </div>
              {quizData.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="absolute top-3 right-3 text-red-500 font-bold hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Add Question
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          Update Quiz
        </button>
      </form>
    </div>
  );
};

export default UpdateQuiz;
