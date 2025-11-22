import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mock user
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Temporary bypass for testing without backend
    const mockUser = {
      _id: '1',
      name: 'Test User',
      email: email,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    
    return { success: true };
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await authService.register(name, email, password, role);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      authService.setAuthToken(token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
    authService.setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const requestPasswordReset = async (email) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
      };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await authService.resetPassword(email, otp, newPassword);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      authService.setAuthToken(token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};