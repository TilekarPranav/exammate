import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { languages } from "../data/Data.js";

export default function Home() {
  const [showCards, setShowCards] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center text-center text-white px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-light mb-6 font-poppins"
      >
        Welcome to{" "}
        <span className="text-emerald-400" style={{ fontFamily: "'Pacifico', cursive" }}>
          Exammate
        </span>
      </motion.h1>

      <AnimatePresence mode="wait">
        {!showCards ? (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <motion.p
              className="text-lg md:text-xl text-gray-200 mb-8 mt-5 font-poppins"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Your one-stop platform for taking quizzes, tracking progress, and managing your learning journey.
              <span className="text-emerald-400 font-light" style={{ fontFamily: "'Pacifico', cursive" }}>
                {" "}Learn coding, improve skills,{" "}
              </span>
              and track your performance across multiple programming languages.
            </motion.p>

            <motion.p
              className="text-md md:text-lg text-gray-300 mb-8 font-poppins"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Take quizzes in{" "}
              <span className="text-emerald-400" style={{ fontFamily: "'Pacifico', cursive" }}>
                Java, React, HTML, CSS, JavaScript
              </span>{" "}
              and more — each with{" "}
              <span className="text-emerald-400" style={{ fontFamily: "'Pacifico', cursive" }}>
                Easy, Medium, Hard
              </span>{" "}
              levels to help you grow step by step.
            </motion.p>

            <Link
              to="/quizzes"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold shadow-lg transition no-underline text-white"
            >
              Get Started
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10"
          >
            {languages.map((lang, index) => (
              <motion.div
                key={lang.name}
                className="bg-gray-800 p-5 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition transform"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <img
                  src={lang.img}
                  alt={lang.name}
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">{lang.name}</h3>
                <p className="text-gray-300 text-sm">{lang.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 mt-10">
        <button
          onClick={() => setShowCards(false)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            !showCards ? "bg-emerald-400 scale-125" : "bg-gray-500"
          }`}
        ></button>
        <button
          onClick={() => setShowCards(true)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            showCards ? "bg-emerald-400 scale-125" : "bg-gray-500"
          }`}
        ></button>
      </div>
    </div>
  );
}
