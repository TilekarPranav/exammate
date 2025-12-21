import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../Store/authStore";
import LOGO from "../assets/LOGO.png";

export default function Navbar() {
  const { logout } = useAuthStore();

  return (
    <nav className="bg-white/10 backdrop-blur-md text-white shadow-md h-18 flex items-center">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <img
            src={LOGO}
            alt="Logo"
            className="h-38 w-38 object-contain"
          />
        </div>

        <ul className="hidden md:flex space-x-8 text-lg font-medium">
          <li>
            <Link
              to="/"
              className="hover:text-gray-200 transition"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/quizzes"
              className="hover:text-gray-200 transition"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Quizzes
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard-page"
              className="hover:text-gray-200 transition"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Dashboard
            </Link>
          </li>
        </ul>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700/80 text-white font-light rounded-lg shadow-lg"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
}
