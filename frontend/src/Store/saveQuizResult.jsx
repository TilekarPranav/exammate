const URL = import.meta.env.FRONTEND_URL || "http://localhost:5000";
export const saveQuizResult = async (resultData) => {
  try {
    if (!resultData.quizId) throw new Error("quizId is required");

    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      throw new Error("No valid token found. Please login again.");
    }

    const res = await fetch(
      `${URL}/api/quiz/submit/${resultData.quizId}`,
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

    return data; 
  } catch (error) {
    console.error("Error in saveQuizResult:", error);
    throw error;
  }
};

export const getQuizResults = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") throw new Error("User not authenticated");

    const res = await fetch(`${URL}/api/quiz/result`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch results");

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
