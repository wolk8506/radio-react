import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchWeatherMonth } from './operation';
import { initStateWeatherMonth as initState } from './init-state-mock';
import moment from 'moment';

const data = createReducer(initState, builder => {
  builder.addCase(fetchWeatherMonth.fulfilled, (state, action) => action.payload);
});

const loading = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherMonth.pending, () => true)
    .addCase(fetchWeatherMonth.fulfilled, () => false)
    .addCase(fetchWeatherMonth.rejected, () => false);
});

const status = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherMonth.pending, () => false)
    .addCase(fetchWeatherMonth.fulfilled, () => true)
    .addCase(fetchWeatherMonth.rejected, () => false);
});

const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchWeatherMonth.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

export default combineReducers({
  data,
  loading,
  status,
  timeUpdate,
});
