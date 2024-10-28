import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchWeatherAirQuality } from './operation';
import { initStateWeatherAirQuality as initState } from './init-state-mock';
import moment from 'moment';

const data = createReducer(initState, builder => {
  builder.addCase(fetchWeatherAirQuality.fulfilled, (state, action) => action.payload);
});

const loading = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherAirQuality.pending, () => true)
    .addCase(fetchWeatherAirQuality.fulfilled, () => false)
    .addCase(fetchWeatherAirQuality.rejected, () => false);
});

const status = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherAirQuality.pending, () => false)
    .addCase(fetchWeatherAirQuality.fulfilled, () => true)
    .addCase(fetchWeatherAirQuality.rejected, () => false);
});

const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchWeatherAirQuality.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

export default combineReducers({
  data,
  loading,
  status,
  timeUpdate,
});
