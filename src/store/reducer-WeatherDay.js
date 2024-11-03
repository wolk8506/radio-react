import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchWeatherYesterday, fetchWeatherToday, fetchWeatherTomorrow } from './operation';
import { initStateWeatherDay as initState } from './init-state-mock';
import moment from 'moment';

//

const data_yesterday = createReducer(initState.yesterday, builder => {
  builder.addCase(fetchWeatherYesterday.fulfilled, (state, action) => action.payload);
});

const loading_yesterday = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherYesterday.pending, () => true)
    .addCase(fetchWeatherYesterday.fulfilled, () => false)
    .addCase(fetchWeatherYesterday.rejected, () => false);
});

const status_yesterday = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherYesterday.pending, () => false)
    .addCase(fetchWeatherYesterday.fulfilled, () => true)
    .addCase(fetchWeatherYesterday.rejected, () => false);
});

const timeUpdate_yesterday = createReducer('--:--', builder => {
  builder.addCase(fetchWeatherYesterday.fulfilled, () => moment().format('HH:mm'));
});

//

const data_today = createReducer(initState.today, builder => {
  builder.addCase(fetchWeatherToday.fulfilled, (state, action) => action.payload);
});

const loading_today = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherToday.pending, () => true)
    .addCase(fetchWeatherToday.fulfilled, () => false)
    .addCase(fetchWeatherToday.rejected, () => false);
});

const status_today = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherToday.pending, () => false)
    .addCase(fetchWeatherToday.fulfilled, () => true)
    .addCase(fetchWeatherToday.rejected, () => false);
});

const error_today = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherToday.pending, () => false)
    .addCase(fetchWeatherToday.fulfilled, () => false)
    .addCase(fetchWeatherToday.rejected, () => true);
});

const timeUpdate_today = createReducer('--:--', builder => {
  builder.addCase(fetchWeatherToday.fulfilled, () => moment().format('HH:mm'));
});

//

const data_tomorrow = createReducer(initState.tomorrow, builder => {
  builder.addCase(fetchWeatherTomorrow.fulfilled, (state, action) => action.payload);
});

const loading_tomorrow = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTomorrow.pending, () => true)
    .addCase(fetchWeatherTomorrow.fulfilled, () => false)
    .addCase(fetchWeatherTomorrow.rejected, () => false);
});

const status_tomorrow = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTomorrow.pending, () => false)
    .addCase(fetchWeatherTomorrow.fulfilled, () => true)
    .addCase(fetchWeatherTomorrow.rejected, () => false);
});

const timeUpdate_tomorrow = createReducer('--:--', builder => {
  builder.addCase(fetchWeatherTomorrow.fulfilled, () => moment().format('HH:mm'));
});

//

export default combineReducers({
  //
  data_yesterday,
  loading_yesterday,
  status_yesterday,
  timeUpdate_yesterday,
  //
  data_today,
  loading_today,
  status_today,
  timeUpdate_today,
  error_today,
  //
  data_tomorrow,
  loading_tomorrow,
  status_tomorrow,
  timeUpdate_tomorrow,
});
