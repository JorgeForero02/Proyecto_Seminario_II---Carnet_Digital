// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 1) Configura el header de autorización
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 2) Decodifica para obtener id y roles
        const { id, roles: decodedRoles } = jwtDecode(token);

        // 3) Solicita tu perfil al backend
        const response = await api.get(`/usuarios/${id}`);
        const profile = response.data;

        // 4) Mezcla profile con los roles del token
        setUser({
          ...profile,
          roles: decodedRoles
        });
      } catch (err) {
        console.error('Error cargando perfil', err);
        // Si falla (token inválido/expirado), limpia todo
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { token: newToken, id } = response.data;

      // Guarda token y actualiza estado
      localStorage.setItem('token', newToken);
      setToken(newToken);

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
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
