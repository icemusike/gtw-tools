import axios from 'axios';

// Use relative API URL for production
const API_URL = '/api';

export const getAuthUrl = async () => {
  const response = await axios.get(`${API_URL}/auth-url`);
  return response.data;
};

export const exchangeCodeForToken = async (code) => {
  const response = await axios.post(`${API_URL}/auth/token`, { code });
  return response.data;
};

export const refreshToken = async () => {
  const response = await axios.post(`${API_URL}/auth/refresh`);
  return response.data;
};

export const checkAuthStatus = async () => {
  const response = await axios.get(`${API_URL}/auth/status`);
  return response.data;
};
