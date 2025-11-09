import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const QuizCard = ({ quiz, index }) => {

  const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const imageUrl = quiz.image
    ? `${URL}${quiz.image}`
    : "https://via.placeholder.com/400x200?text=Quiz+Image";

  return (
    <motion.div
      className="w-full h-[320px] rounded-lg shadow-md overflow-hidden mb-5 flex flex-col bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <div className="p-3 flex-shrink-0">
        <img
          src={imageUrl}
          alt={quiz.title}
          className="rounded-md h-[150px] w-full object-cover"
        />
      </div>

      <div className="p-3 flex flex-col flex-1 overflow-hidden">
        <h5 className="text-lg font-bold mb-1 truncate" title={quiz.title}>
          {quiz.title}
        </h5>
        <p className="text-sm mb-1 truncate" title={`${quiz.questions?.length} Question(s)`}>
          {quiz.questions?.length} Question(s)
        </p>
        <p className="text-sm mb-3 truncate" title={`Level: ${quiz.level}`}>
          Level: {quiz.level}
        </p>

        <div className="mt-auto flex justify-between items-center">
          <p className="text-xs font-bold text-gray-600 truncate">
            ⏱ {quiz.timeLimit} sec
          </p>
          <Link
            to={`/quiz/${quiz._id}`}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md text-sm transition-colors"
          >
            Start
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizCard;
