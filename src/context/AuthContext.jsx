import React, { createContext, useState, useCallback, useEffect } from 'react';
import { apiPost } from '../config/apiClient';

export const AuthContext = createContext(undefined);

/**
 * Authentication provider that wraps the application.
 * Manages auth state and persists session to localStorage.
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  /**
   * Authenticates user and saves session to localStorage.
   * 
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Server response with user data
   * @throws {Error} On authentication failure
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiPost('/auth/login?lang=ru', {
        email,
        password,
      });
      
      const userData = {
        email,
        ...data.data,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return data;
    } catch (err) {
      const errorMessage = err.data?.detail || err.message || 'Ошибка при входе';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
