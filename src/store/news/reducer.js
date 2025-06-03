import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { newsOperations } from 'store';
import { initStateNews } from './init-state-mock';
import moment from 'moment';

const initState = {
  data: initStateNews,
  loading: false,
  status: true,
  timeUpdate: '----.--.-- --:--:--',
};

const news = createReducer(initState, builder => {
  builder
    .addCase(newsOperations.fetchNews.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.timeUpdate = moment().format('YYYY.MM.DD HH:mm:ss');
    })
    .addCase(newsOperations.fetchNews.pending, (state, action) => {
      state.loading = true;
      state.status = false;
    })
    .addCase(newsOperations.fetchNews.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
    });
});

export default combineReducers({
  news,
});
