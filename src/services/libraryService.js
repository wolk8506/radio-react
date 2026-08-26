import axios from 'axios';

// Чтение для главной страницы (публично)
export const fetchEvents = date =>
  axios.get(`/library/events?date=${date}`).then(r => r.data.data.items);

export const fetchFacts = date =>
  axios.get(`/library/facts?date=${date}`).then(r => r.data.data.items);

export const fetchJokes = (count = 3) =>
  axios.get(`/library/jokes/random?count=${count}`).then(r => r.data.data.items);

// Управление (требует прав админа)
export const listLibrary = (type, params = {}) =>
  axios.get(`/library/${type}`, { params }).then(r => r.data.data.items);

export const createLibrary = (type, body) =>
  axios.post(`/library/${type}`, body).then(r => r.data.data.item);

export const updateLibrary = (type, id, body) =>
  axios.patch(`/library/${type}/${id}`, body).then(r => r.data.data.item);

export const deleteLibrary = (type, id) =>
  axios.delete(`/library/${type}/${id}`).then(r => r.data);
