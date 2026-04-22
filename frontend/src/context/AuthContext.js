// Auth Context — Manages user login state across the entire app
// Uses React Context API to share auth state globally
// Token is stored in localStorage for persistence

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context in any component
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user was previously logged in
  useEffect(() => {
    const token = localStorage.getItem('fundit_token');
    const savedUser = localStorage.getItem('fundit_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Set default Authorization header for all API requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('fundit_token');
        localStorage.removeItem('fundit_user');
      }
    }
    setLoading(false);
  }, []);

  // Login: save user data and token
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('fundit_token', token);
    localStorage.setItem('fundit_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Logout: clear all auth state
  const logout = () => {
    setUser(null);
    localStorage.removeItem('fundit_token');
    localStorage.removeItem('fundit_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Helper functions
  const isAuthenticated = () => !!user;
  const isAdmin = () => user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
