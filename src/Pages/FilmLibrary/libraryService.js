import axios from 'axios';
import { BASE_URL } from '../../config';

// Отдельный инстанс axios для обращений к бэкенду медиатеки.
// Не наследует глобальные настройки из store/auth/operations.js (baseURL/Authorization),
// но сам подставляет токен из localStorage через перехватчик.
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Бэкенд оборачивает ответ в { status, code, data: { result } }
const unwrap = res => res.data.data.result;

export const libraryService = {
  // Получить коллекции пользователя (свои + общие)
  getCollections: async () => unwrap(await api.get('/filmLibrary')),

  // Создать коллекцию
  createCollection: async (name, isPublic = false) =>
    unwrap(await api.post('/filmLibrary', { name, isPublic })),

  // Переименовать коллекцию
  renameCollection: async (id, name) =>
    unwrap(await api.patch(`/filmLibrary/${id}`, { name })),

  // Удалить коллекцию
  deleteCollection: async id => unwrap(await api.delete(`/filmLibrary/${id}`)),

  // Добавить фильм в коллекцию
  addMovie: async (id, movie) =>
    unwrap(await api.post(`/filmLibrary/${id}/movies`, movie)),

  // Удалить фильм из коллекции
  removeMovie: async (id, movieId) =>
    unwrap(await api.delete(`/filmLibrary/${id}/movies/${movieId}`)),

  // Изменить порядок фильмов
  reorderMovies: async (id, orderedIds) =>
    unwrap(await api.patch(`/filmLibrary/${id}/movies/order`, { orderedIds })),

  // Отметить/снять «просмотрено» (персонально для текущего пользователя)
  setWatched: async (id, movieId, watched) =>
    unwrap(await api.patch(`/filmLibrary/${id}/movies/${movieId}/watched`, { watched })),

  // Сделать подборку общей/личной
  setPublic: async (id, isPublic) =>
    unwrap(await api.patch(`/filmLibrary/${id}/visibility`, { isPublic })),
};
