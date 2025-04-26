// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if token exists on load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user profile
          const response = await api.get('/usuarios/perfil');
          setUser(response.data);
        } catch (error) {
          console.error('Error loading user', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(credentials);
      if (success) {
        navigate('/');
      } else {
        setError('Credenciales inválidas. Por favor intente de nuevo.');
      }
    } catch (err) {
      setError('Error en el servidor. Intente más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sistema de Gestión Académica</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

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

// src/components/UserCard.js
import React from 'react';
import '../styles/UserCard.css';

const UserCard = ({ user }) => {
  // Determine user type based on roles
  const getUserType = () => {
    if (user.roles.includes('ESTUDIANTE')) {
      return 'Estudiante';
    } else if (user.roles.includes('DOCENTE')) {
      return 'Docente';
    } else if (user.roles.includes('ADMINISTRATIVO')) {
      return 'Administrativo';
    }
    return 'Usuario';
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h3>Carnet Institucional</h3>
      </div>
      
      <div className="user-card-body">
        <div className="user-photo">
          {/* Placeholder for user photo */}
          <div className="photo-placeholder">
            {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
          </div>
        </div>
        
        <div className="user-info">
          <p className="user-name">{user.nombres} {user.apellidos}</p>
          <p className="user-id">ID: {user.cedula}</p>
          <p className="user-type">{getUserType()}</p>
          <p className="user-email">{user.email}</p>
          
          {user.roles.includes('ESTUDIANTE') && user.estudiante && (
            <>
              <p className="user-program">Programa: {user.estudiante.programa?.nombre || 'No disponible'}</p>
              <p className="user-semester">Semestre: {user.estudiante.semestre}</p>
            </>
          )}
          
          {user.roles.includes('DOCENTE') && user.docente && (
            <>
              <p className="user-department">Departamento: {user.docente.departamento?.nombre || 'No disponible'}</p>
              <p className="user-specialty">Especialidad: {user.docente.especialidad}</p>
            </>
          )}
          
          {user.roles.includes('ADMINISTRATIVO') && user.administrativo && (
            <>
              <p className="user-department">Departamento: {user.administrativo.departamento?.nombre || 'No disponible'}</p>
              <p className="user-position">Cargo: {user.administrativo.cargo}</p>
            </>
          )}
        </div>
      </div>
      
      <div className="user-card-footer">
        <p className="university-name">Universidad Nacional de Colombia</p>
      </div>
    </div>
  );
};

export default UserCard;

// src/styles/App.css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
}

// src/styles/LoginPage.css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #3f51b5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #555;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.login-button {
  padding: 0.75rem;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #303f9f;
}

.login-button:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

// src/styles/DashboardPage.css
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background-color: #3f51b5;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid white;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-button:hover {
  background-color: white;
  color: #3f51b5;
}

.dashboard-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.welcome-message {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-message h2 {
  margin-bottom: 1rem;
  color: #3f51b5;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.25rem;
  color: #3f51b5;
}

// src/styles/UserCard.css
.user-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.user-card-header {
  background-color: #3f51b5;
  color: white;
  padding: 1rem;
  text-align: center;
}

.user-card-body {
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
}

.user-photo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-placeholder {
  width: 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: #3f51b5;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.user-id {
  font-weight: 500;
  color: #555;
}

.user-type {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.user-card-footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
}