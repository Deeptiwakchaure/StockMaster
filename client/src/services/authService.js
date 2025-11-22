import api, { setAuthToken as setToken } from './api';

const authService = {
  setAuthToken: setToken,
  
  register: async (name, email, password, role) => {
    return await api.post('/auth/register', { name, email, password, role });
  },
  
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },
  
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },
  
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: async (email, otp, newPassword) => {
    return await api.post('/auth/reset-password', { email, otp, newPassword });
  }
};

export default authService;