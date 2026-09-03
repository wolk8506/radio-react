import axios from 'axios';
import { BASE_URL } from '../../../config';

const api = axios.create({ baseURL: BASE_URL });

export const radioService = {
  // Список станций (backend)
  getStations: async () => (await api.get('/radio/stations')).data.data.result,
  // Что играет на всех станциях (закешировано на бэкенде)
  getNowPlaying: async () => (await api.get('/radio/now-playing')).data.data.result,
  // История воспроизведения за последний час для конкретной станции
  getHistory: async (stationId) => (await api.get(`/radio/history/${stationId}`)).data.data.result,
};
