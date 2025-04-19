import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchNews } from './operation';
import { initStateNews } from './init-state-mock';
import moment from 'moment';

const data = createReducer(initStateNews, builder => {
  builder.addCase(fetchNews.fulfilled, (state, action) => action.payload);
});

const loading = createReducer(false, builder => {
  builder
    .addCase(fetchNews.pending, () => true)
    .addCase(fetchNews.fulfilled, () => false)
    .addCase(fetchNews.rejected, () => false);
});

const status = createReducer(false, builder => {
  builder
    .addCase(fetchNews.pending, () => false)
    .addCase(fetchNews.fulfilled, () => true)
    .addCase(fetchNews.rejected, () => false);
});

const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchNews.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

//

export default combineReducers({
  data,
  loading,
  status,
  timeUpdate,
});
