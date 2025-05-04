import axios from 'axios';

// Use relative API URL for production
const API_URL = '/api';

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/status`);
    return response.data;
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false };
  }
};

export const getAuthUrl = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth-url`);
    console.log('Auth URL for authentication:', response.data.url);
    return response.data;
  } catch (error) {
    console.error('Failed to get auth URL:', error);
    throw error;
  }
};

export const exchangeCodeForToken = async (code) => {
  try {
    console.log('Exchanging code for token, code:', code);
    const response = await axios.post(`${API_URL}/auth/token`, { code });
    console.log('Token exchange response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to exchange code for token:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`);
    return response.data;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

export const getDebugInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/debug/token`);
    return response.data;
  } catch (error) {
    console.error('Failed to get debug info:', error);
    return {
      error: error.message,
      hasAccessToken: false,
      hasRefreshToken: false
    };
  }
};
