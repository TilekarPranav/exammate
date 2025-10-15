import { Link, useNavigate } from "react-router-dom";
import { Home, PlusCircle, Edit, Trash2, Users, LogOut } from "lucide-react";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-2xl font-bold text-green-400">
            Admin Panel
          </div>

          <div className="flex space-x-6">
            <Link to="/home" className="flex items-center space-x-1 hover:text-green-400 transition">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/create-quiz" className="flex items-center space-x-1 hover:text-green-400 transition">
              <PlusCircle size={20} />
              <span>Create Quiz</span>
            </Link>
            <Link to="/update-quiz" className="flex items-center space-x-1 hover:text-green-400 transition">
              <Edit size={20} />
              <span>Update Quiz</span>
            </Link>
            <Link to="/delete-quiz" className="flex items-center space-x-1 hover:text-green-400 transition">
              <Trash2 size={20} />
              <span>Delete Quiz</span>
            </Link>
            <Link to="/users-info" className="flex items-center space-x-1 hover:text-green-400 transition">
              <Users size={20} />
              <span>Users Info</span>
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-red-400 hover:text-red-500 cursor-pointer transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
