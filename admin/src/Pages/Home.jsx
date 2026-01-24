import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Copy } from "lucide-react";

export default function Home() {
  const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const FALLBACK_IMAGE =
    "https://res.cloudinary.com/dldbkluhj/image/upload/v1/quiz_fallback.jpg";

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${URL}/api/quiz/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data.quizzes);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch quizzes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    alert(`Quiz ID copied: ${id}`);
  };

  if (loading) return <div className="p-5 text-white">Loading quizzes...</div>;
  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold text-white text-center mb-10"
      >
        Created <span className="text-emerald-400">Quizzes</span>
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {quizzes.map((quiz, idx) => {
          const imageUrl =
            quiz.image && quiz.image.trim() !== ""
              ? quiz.image
              : FALLBACK_IMAGE;

          return (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:scale-105 hover:shadow-xl transition transform duration-300 max-w-[400px] mx-auto"
            >
              <div className="h-32 w-full">
                <img
                  src={imageUrl}
                  alt={quiz.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h2 className="text-md font-bold text-white text-center mb-1 truncate">
                  {quiz.title}
                </h2>

                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-300 truncate">
                    {quiz.subject}
                  </span>
                  <span className="text-gray-400">
                    {quiz.level} | {quiz.timeLimit}s
                  </span>
                </div>

                <p className="text-gray-300 text-xs text-center truncate mb-2">
                  <span className="font-semibold">ID:</span> {quiz._id}
                </p>

                <div className="flex justify-between mt-auto gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(quiz._id);
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    <Copy size={12} /> Copy
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/update-quiz`);
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <Edit size={12} /> Update
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/delete-quiz`);
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
