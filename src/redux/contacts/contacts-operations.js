import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

axios.defaults.baseURL = 'https://contact-rest-api.herokuapp.com/api';

export const fetchContact = createAsyncThunk(
  'contacts/fetchContact',
  async () => {
    const response = await axios.get('/contacts');
    return response.data.data.result;
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async contact => {
    const { name, phone, email } = contact;
    const response = await axios.post('/contacts', { name, phone, email });
    return response.data.data.result;
  }
);

export const removeContact = createAsyncThunk(
  'contacts/removeContact',
  async id => {
    const response = await axios.delete(`/contacts/${id}`);
    return response.data.data.result;
  }
);

export const favoriteContact = createAsyncThunk(
  'contacts/favorite',
  async contact => {
    const { _id, favorite } = contact;
    const response = await axios.patch(`/contacts/${_id}/favorite`, {
      favorite: !favorite,
    });
    return response.data.data.result;
  }
);
