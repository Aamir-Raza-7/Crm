import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes — redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Forgot password — UI only */}
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-slate-400 text-sm">
                      Password reset functionality is coming soon. Please contact your administrator.
                    </p>
                    <a href="/login" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                      Back to Login
                    </a>
                  </div>
                </div>
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-7xl font-black text-indigo-600">404</p>
                  <p className="text-white text-xl font-semibold mt-3">Page not found</p>
                  <a href="/dashboard" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
