import axios from 'axios';
import { BASE_URL } from '../../config';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = res => res.data.data.result;

export const eventsService = {
  getEvents: async () => unwrap(await api.get('/events')),
  createEvent: async data => unwrap(await api.post('/events', data)),
  updateEvent: async (id, data) => unwrap(await api.patch(`/events/${id}`, data)),
  deleteEvent: async id => unwrap(await api.delete(`/events/${id}`)),
};
