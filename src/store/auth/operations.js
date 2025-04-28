import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { BASE_URL } from 'store/env';

axios.defaults.baseURL = BASE_URL;

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};

export const register = createAsyncThunk('auth/register', async credentials => {
  try {
    const response = await axios.post('/auth/register', credentials);
    token.set(response.token);
    if (response.data.code === 201) {
      toast.info(
        `📨 An email has been sent to your mail ${response.data.code} to confirm your registration. To activate your account, follow the link in the email❗❗❗`,
        {
          position: 'top-center',
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
    return response.data;
  } catch (error) {
    console.log('❌ error', error);
  }
});

export const logIn = createAsyncThunk('auth/login', async credentials => {
  try {
    const { data } = await axios.post('/auth/login', credentials);
    token.set(data.token);
    return data.data;
  } catch (error) {
    toast.warn('Wrong username or password');
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

export const updateEmail = createAsyncThunk('auth/email', async credentials => {
  try {
    const response = await axios.patch('/user/email', credentials);
    return response.data;
  } catch (error) {
    console.log('❌ error', error);
    if (error.status === 409) {
      toast.error(`${error.response.data.message}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 1,
      });
    }
  }
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

export const logOut = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.get('/auth/logout');
    token.unset();
  } catch (error) {
    console.log('❌ error', error);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (persistedToken === null) {
    return thunkAPI.rejectWithValue();
  }

  token.set(persistedToken);
  try {
    const { data } = await axios.get('/user/current');
    return data.data.user;
  } catch (error) {
    if (error.status === 401) {
      return { token: null, status: 401 };
    } else console.log('❌ error', error);
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
