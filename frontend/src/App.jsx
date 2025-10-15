import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./Store/authStore";

import FloatingShape from "./Components/FloatingShape";
import LoadingSpinner from "./Components/LoadingSpinner";

import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import QuizzesPage from "./Pages/QuizzesPage";
import Quiz from "./Pages/Quiz";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import DashboardPage from "./Pages/DashboardPage"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingShape />
      </div>

      {isAuthenticated && user?.isVerified && <Navbar />}

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/dashboard-page" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          <Route path="/signup" element={<RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser>} />
          <Route path="/login" element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
          <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
          <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
