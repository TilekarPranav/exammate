import React, { useState } from "react";
import axios from "axios";

const DeleteQuiz = () => {
  const [quizId, setQuizId] = useState("");

  const handleDelete = async () => {
    if (!quizId) {
      alert("Please enter a Quiz ID to delete");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete quiz with ID: ${quizId}?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a quiz");
        return;
      }

      const res = await axios.delete(
        `http://localhost:5000/api/quiz/delete/${quizId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Quiz deleted successfully!");
      setQuizId("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete quiz");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gray-50">
      <h1 className="text-3xl font-bold mb-5 text-red-600">Delete Quiz</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4">
        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-red-400"
        />
        <button
          onClick={handleDelete}
          className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
        >
          Delete Quiz
        </button>
      </div>
    </div>
  );
};

export default DeleteQuiz;
