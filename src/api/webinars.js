import axios from 'axios';

const API_URL = '/api';

export const getWebinars = async () => {
  const response = await axios.get(`${API_URL}/webinars`);
  return response.data;
};

export const getWebinarDetails = async (webinarKey) => {
  const response = await axios.get(`${API_URL}/webinars/${webinarKey}`);
  return response.data;
};

export const getAttendees = async (webinarKey) => {
  const response = await axios.get(`${API_URL}/webinars/${webinarKey}/attendees`);
  return response.data;
};

export const getRegistrantDetails = async (webinarKey, registrantKey) => {
  const response = await axios.get(`${API_URL}/webinars/${webinarKey}/registrants/${registrantKey}`);
  return response.data;
};

export const sendMessage = async (webinarKey, sessionKey, registrantKey, message) => {
  const response = await axios.post(
    `${API_URL}/webinars/${webinarKey}/sessions/${sessionKey}/attendees/${registrantKey}/message`,
    { message }
  );
  return response.data;
};

export const sendMessagesToAll = async (webinarKey, sessionKey, messageTemplate, defaultAffiliateId) => {
  const response = await axios.post(
    `${API_URL}/webinars/${webinarKey}/sessions/${sessionKey}/messages`,
    { messageTemplate, defaultAffiliateId }
  );
  return response.data;
};
