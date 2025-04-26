// src/pages/DashboardPage.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserCard from '../components/UserCard';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="loading">Cargando información...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sistema de Gestión Académica</h1>
        <button onClick={logout} className="logout-button">Cerrar Sesión</button>
      </header>
      
      <main className="dashboard-content">
        <UserCard user={user} />
        
        {/* You can add more content or components here */}
        <div className="welcome-message">
          <h2>Bienvenido, {user.nombres}!</h2>
          <p>Utiliza el menú para navegar por el sistema.</p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
