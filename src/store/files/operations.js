import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../config';

axios.defaults.baseURL = BASE_URL;

export const uploadFiles = createAsyncThunk('files/upload', async credentials => {
  try {
    const { data } = await axios.post('/files/upload', credentials);

    return data;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const uploadWalpaper = createAsyncThunk('files/uploadWalpaper', async credentials => {
  try {
    const { data } = await axios.post('/files/walpaper', credentials);

    return data;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const deleteFile = createAsyncThunk('files/deleteFile', async data => {
  const response = await axios.delete('files/delete', {
    data: { filePaths: data },
  });
  return response.data.data.result;
});

export const fileOperations = { uploadFiles, uploadWalpaper, deleteFile };
