import axios from 'axios';

// Сервис для работы с TMDB (поиск фильмов, популярное, жанры).
// Ключ берём из примера FilmLibrary_examp. При необходимости вынести в config/.env.
//
// ВАЖНО: используем отдельный инстанс axios, чтобы не наследовать глобальные
// настройки (axios.defaults.baseURL и заголовок Authorization с токеном бэкенда,
// которые выставляются в store/auth/operations.js). Иначе TMDB получает чужой
// Bearer-токен и отклоняет запросы.

const tmdbAxios = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

const API_KEY = 'a8df323e9ca157a6f58df54190ee006c';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const PLACEHOLDER =
  'https://cdn.pixabay.com/photo/2012/04/14/15/43/film-34332_960_720.png';

export const getPosterUrl = posterPath =>
  posterPath ? `${IMAGE_BASE}${posterPath}` : PLACEHOLDER;

export const tmdbService = {
  // mediaType: 'movie' | 'tv'
  search: (query, mediaType = 'movie', page = 1, lang = 'ru-RU') => {
    const path = mediaType === 'tv' ? 'search/tv' : 'search/movie';
    return tmdbAxios
      .get(path, {
        params: {
          api_key: API_KEY,
          language: lang,
          query,
          page,
          include_adult: false,
        },
      })
      .then(res => res.data);
  },

  getPopular: (mediaType = 'movie', page = 1, lang = 'ru-RU') => {
    const path = mediaType === 'tv' ? 'tv/popular' : 'movie/popular';
    return tmdbAxios
      .get(path, {
        params: { api_key: API_KEY, language: lang, page },
      })
      .then(res => res.data);
  },

  // Жанры фильмов и сериалов объединяем в один словарь
  getGenres: (lang = 'ru-RU') =>
    Promise.all([
      tmdbAxios.get('genre/movie/list', { params: { api_key: API_KEY, language: lang } }),
      tmdbAxios.get('genre/tv/list', { params: { api_key: API_KEY, language: lang } }),
    ])
      .then(([movieRes, tvRes]) => [...movieRes.data.genres, ...tvRes.data.genres])
      .then(genres => {
        const seen = {};
        return genres.filter(g => (seen[g.id] ? false : (seen[g.id] = true)));
      }),

  // Видео (трейлеры/тизеры) по id. mediaType: 'movie' | 'tv'
  getVideos: (id, mediaType = 'movie', lang = 'ru-RU') =>
    tmdbAxios
      .get(`${mediaType === 'tv' ? 'tv' : 'movie'}/${id}/videos`, {
        params: { api_key: API_KEY, language: lang },
      })
      .then(res => res.data.results || [])
      .then(videos =>
        videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find(v => v.site === 'YouTube' && v.type === 'Teaser') ||
        videos.find(v => v.site === 'YouTube') ||
        null,
      ),
};
