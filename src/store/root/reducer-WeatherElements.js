import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchWeatherElements } from './operation';
import { initStateWeatherElements as initState } from './init-state-mock';
import moment from 'moment';

const data = createReducer(initState, builder => {
  builder.addCase(fetchWeatherElements.fulfilled, (state, action) => action.payload);
});

const loading = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherElements.pending, () => true)
    .addCase(fetchWeatherElements.fulfilled, () => false)
    .addCase(fetchWeatherElements.rejected, () => false);
});

const status = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherElements.pending, () => false)
    .addCase(fetchWeatherElements.fulfilled, () => true)
    .addCase(fetchWeatherElements.rejected, () => false);
});

const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchWeatherElements.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

export default combineReducers({
  data,
  loading,
  status,
  timeUpdate,
});
