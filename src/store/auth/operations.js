import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

axios.defaults.baseURL = BASE_URL;

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};

export const fetchCurrentUser = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
  const persistedToken = localStorage.getItem('authToken'); // Получение токена из localStorage

  if (!persistedToken) {
    return thunkAPI.rejectWithValue('Токен не найден');
  }

  token.set(persistedToken); // Установка токена
  try {
    const { data } = await axios.get('/user/current');
    return data.data.user; // Возвращение данных пользователя
  } catch (error) {
    console.error('❌ error', error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Авторизация
export const logIn = createAsyncThunk('auth/login', async credentials => {
  try {
    const { data } = await axios.post('/auth/login', credentials);
    token.set(data.token);
    localStorage.setItem('authToken', data.token); // Сохраняем токен
    return data.data;
  } catch (error) {
    toast.error('Неправильный email или пароль!');
    throw error;
  }
});

// Выход
export const logOut = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.get('/auth/logout');
    token.unset();
    localStorage.removeItem('authToken'); // Удаляем токен
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  }
});
// ------------------------------------------------------------------------------------

// Регистрация пользователя
export const register = createAsyncThunk('auth/register', async credentials => {
  try {
    const response = await axios.post('/auth/register', credentials);
    token.set(response.token);
    toast.info(`📨 Email отправлен на ${credentials.email} для подтверждения регистрации.`, {
      position: 'top-center',
      autoClose: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('❌ error', error);
    throw error;
  }
});

// Пример операций с данными пользователя
export const updateEmail = createAsyncThunk('auth/email', async (credentials, thunkAPI) => {
  try {
    const response = await axios.patch('/user/email', credentials);
    return response.data;
  } catch (error) {
    console.error('❌ error', error);
    if (error.response?.status === 409) {
      toast.error(`${error.response.data.message}`, { position: 'top-center', autoClose: 5000 });
    }
    return thunkAPI.rejectWithValue(error.response?.data || 'Unknown error');
  }
});

// ! update start

export const updateAvatar = createAsyncThunk('auth/avatars', async credentials => {
  try {
    const { data } = await axios.patch('/user/avatars', credentials);

    return data;
  } catch (error) {
    return Promise.reject(error);
  }
});
export const uploadFiles = createAsyncThunk('files/upload', async credentials => {
  try {
    const { data } = await axios.post('/files/upload', credentials);

    return data;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const updateName = createAsyncThunk('auth/name', async credentials => {
  try {
    const response = await axios.patch('/user/name', credentials);
    return response.data;
  } catch (error) {}
});

// ! update end

export const verifyEmail = createAsyncThunk('auth/verify', async credentials => {
  try {
    const { data } = await axios.post('/user/verify', credentials);

    return data;
  } catch (error) {
    console.log('❌ error', error);
  }
});

// ~ Изменение пароля
export const changePassword = createAsyncThunk('user/changePassword', async credentials => {
  try {
    const { data } = await axios.post('/user/change-password', credentials);

    return data;
  } catch (error) {
    console.log('❌ error', error);
  }
});
// ~ Добавление рецепта в избранное, запись рецептов юзеру
export const updateRecipeFavoriteById = createAsyncThunk('recipe/favorite', async _id => {
  const response = await axios.patch(`/recipe/${_id}/favorite`);
  return response.data.data;
});
// ~ Удаление рецептп из избранного
export const removeRecipeFavoriteById = createAsyncThunk('recipe/favorite', async _id => {
  const response = await axios.delete(`/recipe/${_id}/favorite`);
  return response.data.data;
});
