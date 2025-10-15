import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import FloatingShape from "./Components/FloatingShape";
import AdminNavbar from "./Pages/AdminNavbar";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import CreateQuiz from "./Pages/CreateQuiz";
import UpdateQuiz from "./Pages/UpdateQuiz";
import DeleteQuiz from "./Pages/DeleteQuiz";
import UsersInfo from "./Pages/UsersInfo";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/"; 

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingShape />
      </div>
      {!hideNavbar && <AdminNavbar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <PrivateRoute>
                <CreateQuiz />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-quiz"
            element={
              <PrivateRoute>
                <UpdateQuiz />
              </PrivateRoute>
            }
          />
          <Route
            path="/delete-quiz"
            element={
              <PrivateRoute>
                <DeleteQuiz />
              </PrivateRoute>
            }
          />
          <Route
            path="/users-info"
            element={
              <PrivateRoute>
                <UsersInfo />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
