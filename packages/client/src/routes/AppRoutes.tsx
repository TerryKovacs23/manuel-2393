import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../modules/auth/components/LoginPage';
import { RegistrationPage } from '../modules/auth/components/RegistrationPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardPage } from '../modules/dashboard/components/components/DashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}