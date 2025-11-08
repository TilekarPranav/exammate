import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersInfo = () => {

  const URL = import.meta.env.VITE_ADMIN_URL || "http://localhost:5000";

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-indigo-600">Users Info</h1>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
      />

      <div className="space-y-4">
        {currentUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition relative"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 text-sm">
                  Verified: {user.isVerified ? "Yes" : "No"} | Last Login:{" "}
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-semibold text-indigo-600">Quizzes Attempted:</h3>
              {user.attemptedQuizzes?.length > 0 ? (
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {user.attemptedQuizzes.map((quiz, idx) => (
                    <li key={idx} className="text-gray-700">
                      <span className="font-medium">{quiz.title}</span> - Score: {quiz.score} | Attempts: {quiz.attempts}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-1">No quizzes attempted</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersInfo;
