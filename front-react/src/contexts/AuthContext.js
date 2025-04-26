// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';
import {jwtDecode} from 'jwt-decode';

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
          
          // Decode token to extract information
          const decodedToken = jwtDecode(token);
          console.log('Decoded token:', decodedToken);
          
          // Get user profile
          const response = await api.get('/usuarios/perfil');
          
          // You can combine profile data with token data if needed
          setUser({
            ...response.data,
            roles: decodedToken.roles
          });
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
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Decode token for additional info
      const decodedToken = jwtDecode(token);
      console.log('Login decoded token:', decodedToken);
      
      // Set state
      setToken(token);
      setUser({
        ...user,
        // Merge with token info if needed
        // decodedRole: decodedToken.role
      });
      
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