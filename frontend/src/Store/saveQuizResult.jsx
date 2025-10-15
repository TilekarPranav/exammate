// frontend/src/api/saveQuizResult.jsx

export const saveQuizResult = async (resultData) => {
  try {
    if (!resultData.quizId) throw new Error("quizId is required");

    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      throw new Error("No valid token found. Please login again.");
    }

    const res = await fetch(
      `https://exammate-backend-wil3.onrender.com/api/quiz/submit/${resultData.quizId}`, // ✅ backticks
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: resultData.answers,
          timeSpent: resultData.timeSpent ?? resultData.time ?? 0,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to save quiz result");

    return data; // { success: true, message: ..., result: ... }
  } catch (error) {
    console.error("Error in saveQuizResult:", error);
    throw error;
  }
};

export const getQuizResults = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") throw new Error("User not authenticated");

    const res = await fetch("https://exammate-backend-wil3.onrender.com/api/quiz/result", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch results");

    // backend returns array
    const results = Array.isArray(data) ? data : data.results || [];

    return results.map((r) => ({
      ...r,
      quiz: r.quiz || { title: "Untitled Quiz" },
      timeSpent: r.timeSpent ?? r.time ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching results:", error);
    return [];
  }
};
