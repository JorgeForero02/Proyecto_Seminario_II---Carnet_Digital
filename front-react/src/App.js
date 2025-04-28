// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AsistenciasPage from './pages/AsistenciasPage';
import UserCard from './components/UserCard';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simple wrapper para mostrar el UserCard como «página» de Carnet
const CarnetPage = () => {
  const { user } = useAuth();
  return (
    <div className="d-flex justify-content-center mb-4">
      <UserCard user={user} />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ allowedRoles, children }) => {
  const { roles } = useAuth();
  const hasAccess = roles?.some(r => allowedRoles.includes(r));
  return hasAccess ? children : <Navigate to="/unauthorized" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard y sus secciones hijas */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            {/* Redirige automáticamente a «carnet» */}
            <Route index element={<Navigate to="carnet" replace />} />
            <Route path="carnet" element={<CarnetPage />} />
            <Route path="asistencias" element={<AsistenciasPage />} />
            <Route path="admin" element={
              <RoleRoute allowedRoles={['ADMINISTRATIVO']}>
                <AdminPage />
              </RoleRoute>
            }/>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
