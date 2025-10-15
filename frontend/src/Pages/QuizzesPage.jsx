import React, { useEffect, useState } from "react";
import QuizCard from "./QuizCard";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("https://exammate-backend-wil3.onrender.com/api/quiz/display");
        if (!res.ok) throw new Error("Failed to fetch quizzes");
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);


  if (loading) return <p className="text-center mt-10">Loading quizzes...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {quizzes.length > 0 ? (
        quizzes.map((quiz, index) => <QuizCard key={quiz._id} quiz={quiz} index={index} />)
      ) : (
        <p className="text-gray-800 col-span-full text-center">No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizzesPage;
