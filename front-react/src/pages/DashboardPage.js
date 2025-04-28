// src/pages/DashboardPage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  LogOut,
  QrCode,
  BookOpen,
  User,
  Settings,
  Menu
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  if (!user) return <div className="loading">Cargando información...</div>;

  return (
    <div className="dashboard-wrapper d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="header bg-dark text-white py-3 px-4 sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="logo-container bg-secondary p-2 rounded me-3">
              <img
                src="/logo-universidad.png"
                alt="Logo Universidad"
                width="70"
                height="80"
                className="rounded"
              />
            </div>
            <h1 className="h4 mb-0 d-none d-md-block">Sistema de Gestión Académica</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-md-flex align-items-center gap-2">
              <span>{user.nombres}</span>
              <div
                className="user-avatar rounded-circle bg-light bg-opacity-25 d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
              >
                <User size={18} />
              </div>
            </div>
            <button onClick={logout} className="btn btn-outline-light btn-sm">
              <LogOut size={18} className="me-2" />
              Cerrar Sesión
            </button>
            <button className="btn btn-dark d-md-none" onClick={() => setSidebarOpen(s => !s)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <div className="main-content d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className={`sidebar bg-light border-end p-3 ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`}
          style={{ width: 250 }}
        >
          <nav className="nav flex-column">
            <button
              onClick={() => navigate('/dashboard/carnet')}
              className="nav-link d-flex align-items-center py-2 px-3 text-dark rounded hover-bg-light text-start border-0 bg-transparent"
            >
              <QrCode size={20} className="me-2" />
              Carné Digital
            </button>
            <button
              onClick={() => navigate('/dashboard/asistencias')}
              className="nav-link d-flex align-items-center py-2 px-3 text-dark rounded hover-bg-light text-start border-0 bg-transparent"
            >
              <BookOpen size={20} className="me-2" />
              Asistencias
            </button>
            <button
              onClick={() => navigate('/dashboard/perfil')}
              className="nav-link d-flex align-items-center py-2 px-3 text-dark rounded hover-bg-light text-start border-0 bg-transparent"
            >
              <User size={20} className="me-2" />
              Perfil
            </button>
            <button
              onClick={() => navigate('/dashboard/configuracion')}
              className="nav-link d-flex align-items-center py-2 px-3 text-dark rounded hover-bg-light text-start border-0 bg-transparent"
            >
              <Settings size={20} className="me-2" />
              Configuración
            </button>
          </nav>
        </aside>

        {/* Aquí se inyecta la página hija (Carnet, Asistencias, etc.) */}
        <main className="content p-4 bg-light flex-grow-1">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-white py-3 px-4">
        <div className="container-fluid text-center">
          <small>© {new Date().getFullYear()} Universidad Francisco de Paula Santander</small>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
