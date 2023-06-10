import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'https://contact-rest-api.herokuapp.com/api';

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};

const register = createAsyncThunk('auth/register', async credentials => {
  try {
    const { data } = await axios.post('/auth/register', credentials);
    token.set(data.token);

    if (data.code === 201) {
      toast.info(
        `📨 An email has been sent to your mail ${data.data.user.email} to confirm your registration. To activate your account, follow the link in the email❗❗❗`,
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 1,
        }
      );
    }
    return data;
  } catch (error) {}
});

const logIn = createAsyncThunk('auth/login', async credentials => {
  try {
    const { data } = await axios.post('/auth/login', credentials);
    console.log(data);
    token.set(data.token);
    return data.data;
  } catch (error) {
    toast.warn('Wrong username or password');
  }
});

const updateAvatar = createAsyncThunk('auth/avatars', async credentials => {
  try {
    const { data } = await axios.patch('/users/avatars', credentials);

    return data;
  } catch (error) {}
});

const verifyEmail = createAsyncThunk('auth/verify', async credentials => {
  try {
    const { data } = await axios.post('/users/verify', credentials);

    return data;
  } catch (error) {}
});

const logOut = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.get('/auth/logout');
    token.unset();
  } catch (error) {}
});

const fetchCurrentUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (persistedToken === null) {
      return thunkAPI.rejectWithValue();
    }

    token.set(persistedToken);
    try {
      const { data } = await axios.get('/users/current');
      return data.data.user;
    } catch (error) {}
  }
);

const operations = {
  register,
  logOut,
  logIn,
  fetchCurrentUser,
  updateAvatar,
  verifyEmail,
};
export default operations;
