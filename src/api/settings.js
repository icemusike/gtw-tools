import axios from 'axios';

// Use relative API URL for production
const API_URL = '/api';

export const getSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`);
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await axios.post(`${API_URL}/settings`, settings);
  return response.data;
};
