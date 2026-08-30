import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTimeManagement = createAsyncThunk(
  'timemanagement/fetch',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/timemanagement');
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const saveTimeManagement = createAsyncThunk(
  'timemanagement/save',
  async ({ tasks, plans }, thunkAPI) => {
    try {
      const { data } = await axios.put('/timemanagement', { tasks, plans });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to save');
    }
  }
);