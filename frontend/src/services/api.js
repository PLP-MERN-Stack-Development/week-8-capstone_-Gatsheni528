import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const fetchSessions = () => API.get('/sessions');
export const joinSession = (id) => API.post(`/sessions/${id}/join`);
export const getMessages = (sessionId) => API.get(`/messages/${sessionId}`);
export const sendMessage = (sessionId, content) =>
  API.post(`/messages/${sessionId}`, { content });

export default API;
