import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import { useState, useEffect } from "react";
import welcomeAnimation from "../data/Welcome.json";
import aiAnimation from "../data/Ai.json";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-6 py-16  overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-light mb-6 font-poppins"
      >
        Welcome to{" "}
        <span
          className="text-emerald-400"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          Exammate
        </span>
      </motion.h1>

      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <Lottie
              animationData={welcomeAnimation}
              loop={false}
              className="w-[300px] md:w-[500px]"
            />
          </motion.div>
        ) : (
          <motion.div
            key="ai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <Lottie
              animationData={aiAnimation}
              loop
              className="w-[300px] md:w-[500px]"
            />
            <Link
              to="/quizzes"
              className="mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold shadow-lg transition no-underline text-white"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
