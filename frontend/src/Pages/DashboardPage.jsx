// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getQuizResults } from "../Store/saveQuizResult";

export default function DashboardPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getQuizResults();
        setResults(data);
      } catch (err) {
        console.error("fetchResults error:", err);
        setError(err.message || "Failed to fetch results");
      }
    };

    fetchResults();
  }, []);

  const formatTime = (seconds) => {
    const sec = Number(seconds) || 0;
    const h = Math.floor(sec / 3600).toString().padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-white">
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
      >
        Dashboard
      </motion.h2>

      {error && <div className="mb-4 text-red-400 text-center">{error}</div>}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Quizzes Taken</h3>
          <p className="text-gray-300 text-lg">{results.length}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Average %</h3>
          <p className="text-gray-300 text-lg">
            {results.length > 0
              ? (
                  results.reduce((acc, r) => acc + (r.percentage || 0), 0) /
                  results.length
                ).toFixed(1) + "%"
              : "0%"}
          </p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Best Score</h3>
          <p className="text-gray-300 text-lg">
            {results.length > 0
              ? Math.max(...results.map((r) => r.percentage || 0)) + "%"
              : "N/A"}
          </p>
        </div>
      </motion.div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="overflow-x-auto bg-gray-900 rounded-2xl shadow-lg"
      >
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="px-6 py-3">Quiz</th>
              <th className="px-6 py-3">Marks</th>
              <th className="px-6 py-3">Correct</th>
              <th className="px-6 py-3">Wrong</th>
              <th className="px-6 py-3">Time Spent</th>
              <th className="px-6 py-3">Percentage</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((r) => (
                <tr key={r._id || r.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-6 py-3">{r.quiz?.title || "Untitled Quiz"}</td>
                  <td className="px-6 py-3">{r.marks || "0/0"}</td>
                  <td className="px-6 py-3">{r.correct || 0}</td>
                  <td className="px-6 py-3">{r.wrong || 0}</td>
                  <td className="px-6 py-3">{formatTime(r.timeSpent)}</td>
                  <td className="px-6 py-3 font-bold">{r.percentage || 0}%</td>
                  <td className="px-6 py-3">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-400 italic">
                  No results yet. Take a quiz to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
