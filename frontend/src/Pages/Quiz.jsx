import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveQuizResult } from "../Store/saveQuizResult";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeSpent, setTimeSpent] = useState(0);

  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!id || fetchCalled.current) return;
    fetchCalled.current = true;

    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") {
          navigate("/login");
          return;
        }

        const res = await fetch(`http://localhost:5000/api/quiz/display/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch quiz");

        const data = await res.json();
        setQuiz(data);
        setTimeLeft(data.questions[0]?.questionTime || 30); // ✅ use per-question time
      } catch (err) {
        console.error("Error fetching quiz:", err);
        navigate("/quizzes");
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  // Timer
  useEffect(() => {
    if (!quiz) return;
    if (timeLeft <= 0) {
      handleNext(); // auto move when time ends
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  const handleOptionChange = (optionIdx) => {
    if (selectedOptions[currentIndex] != null) return;
    setSelectedOptions((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(quiz.questions[currentIndex + 1].questionTime || 30); // ✅ reset per-question time
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (selectedOptions[currentIndex] != null) return;
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTimeLeft(quiz.questions[currentIndex - 1].questionTime || 30); // ✅ reset when going back
    }
  };

  const handleSubmit = async () => {
    const answersArray = quiz.questions.map(
      (q, idx) => selectedOptions[idx] ?? null
    );

    const resultData = {
      quizId: quiz._id,
      answers: answersArray,
      timeSpent: Number(timeSpent) || 0,
    };

    try {
      await saveQuizResult(resultData);
      console.log("Result saved successfully!");
      navigate("/dashboard-page");
    } catch (err) {
      console.error("Error saving result:", err);
    }
  };

  if (!quiz)
    return <p className="text-white text-center mt-10">Loading ....</p>;

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">{quiz.title}</h2>
        <span className="text-orange-500 font-bold">⏳ {timeLeft}s</span>
      </div>

      <h4 className="text-lg font-medium mb-4">
        {currentIndex + 1}. {currentQuestion.questionText}
      </h4>

      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptions[currentIndex] === idx;
          return (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                isSelected ? "bg-blue-200 font-bold" : "hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name={`q${currentIndex}`}
                value={idx}
                checked={isSelected}
                onChange={() => handleOptionChange(idx)}
                className="accent-blue-600"
                disabled={selectedOptions[currentIndex] != null}
              />
              {option}
            </label>
          );
        })}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0 || selectedOptions[currentIndex] != null}
          className={`px-4 py-2 rounded-lg ${
            currentIndex === 0 || selectedOptions[currentIndex] != null
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          }`}
        >
          Prev
        </button>

        {currentIndex < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={selectedOptions[currentIndex] == null}
            className={`px-4 py-2 rounded-lg ${
              selectedOptions[currentIndex] == null
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedOptions[currentIndex] == null}
            className={`px-4 py-2 rounded-lg ${
              selectedOptions[currentIndex] == null
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
