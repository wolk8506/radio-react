import axios from 'axios';
import { BASE_URL } from '../config';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const newsService = {
  // Лента (personalized при наличии токена)
  getFeed: params => api.get('/news/feed', { params }).then(r => r.data),
  getFacets: () => api.get('/news/facets').then(r => r.data),

  // Интересы (auth)
  getInterests: () => api.get('/news/interests').then(r => r.data),
  updateInterests: body => api.put('/news/interests', body).then(r => r.data),

  // Источники (admin)
  getSources: () => api.get('/news/sources').then(r => r.data),
  createSource: body => api.post('/news/sources', body).then(r => r.data),
  updateSource: (id, body) => api.patch(`/news/sources/${id}`, body).then(r => r.data),
  deleteSource: id => api.delete(`/news/sources/${id}`).then(r => r.data),
};
