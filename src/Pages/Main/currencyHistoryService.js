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

// Курсы НБУ за последние N дней: { USD: [{date, rate}], EUR: [...] }
export const currencyHistoryService = {
  getHistory: async (codes = ['USD', 'EUR'], days = 30) =>
    (await api.get('/currency/history', { params: { codes: codes.join(','), days } })).data.data.result,
};
