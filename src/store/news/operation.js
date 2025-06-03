import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const fetchNews = createAsyncThunk('news', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('❌ error', error.response.status, ' ', error.response.statusText);
  }
});
//
export const newsOperations = {
  fetchNews,
};
