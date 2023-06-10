import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { changeFilter } from './contacts-actions';
import {
  fetchContact,
  addContact,
  removeContact,
  favoriteContact,
} from './contacts-operations';

const items = createReducer([], {
  [fetchContact.fulfilled]: (state, action) => action.payload,
  [addContact.fulfilled]: (state, action) => [...state, action.payload],
  [removeContact.fulfilled]: (state, action) =>
    state.filter(({ _id }) => _id !== action.meta.arg),
  [favoriteContact.fulfilled]: (state, action) =>
    state.forEach(function (element) {
      if (element._id === action.payload._id) {
        element.favorite = action.payload.favorite;
      }
    }),
});

const loading = createReducer(false, {
  [fetchContact.pending]: () => true,
  [fetchContact.fulfilled]: () => false,
  [fetchContact.rejected]: () => false,

  [addContact.pending]: () => true,
  [addContact.fulfilled]: () => false,
  [addContact.rejected]: () => false,

  [removeContact.pending]: () => true,
  [removeContact.fulfilled]: () => false,
  [removeContact.rejected]: () => false,

  [favoriteContact.pending]: () => true,
  [favoriteContact.fulfilled]: () => false,
  [favoriteContact.rejected]: () => false,
});

const filter = createReducer('', {
  [changeFilter]: (state, action) => action.payload,
});

export default combineReducers({ items, loading, filter });
