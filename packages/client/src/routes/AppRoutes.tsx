import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../modules/auth/components/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardPage } from '../modules/dashboard/components/components/DashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}