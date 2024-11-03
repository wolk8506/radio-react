import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchWeatherTodayCity1, fetchWeatherTodayCity2 } from './operation';
import { initStateWeatherDay as initState } from './init-state-mock';
import moment from 'moment';

//

const data_city1 = createReducer(initState.today, builder => {
  builder.addCase(fetchWeatherTodayCity1.fulfilled, (state, action) => action.payload);
});

const loading_city1 = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTodayCity1.pending, () => true)
    .addCase(fetchWeatherTodayCity1.fulfilled, () => false)
    .addCase(fetchWeatherTodayCity1.rejected, () => false);
});

const status_city1 = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTodayCity1.pending, () => false)
    .addCase(fetchWeatherTodayCity1.fulfilled, () => true)
    .addCase(fetchWeatherTodayCity1.rejected, () => false);
});

const timeUpdate_city1 = createReducer('--:--', builder => {
  builder.addCase(fetchWeatherTodayCity1.fulfilled, () => moment().format('HH:mm'));
});

//

const data_city2 = createReducer(initState.today, builder => {
  builder.addCase(fetchWeatherTodayCity2.fulfilled, (state, action) => action.payload);
});

const loading_city2 = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTodayCity2.pending, () => true)
    .addCase(fetchWeatherTodayCity2.fulfilled, () => false)
    .addCase(fetchWeatherTodayCity2.rejected, () => false);
});

const status_city2 = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTodayCity2.pending, () => false)
    .addCase(fetchWeatherTodayCity2.fulfilled, () => true)
    .addCase(fetchWeatherTodayCity2.rejected, () => false);
});

const timeUpdate_city2 = createReducer('--:--', builder => {
  builder.addCase(fetchWeatherTodayCity2.fulfilled, () => moment().format('HH:mm'));
});

//

const data_city3 = createReducer(initState.today, builder => {
  builder.addCase(fetchWeatherTodayCity2.fulfilled, (state, action) => action.payload);
});

const loading_city3 = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTodayCity2.pending, () => true)
    .addCase(fetchWeatherTodayCity2.fulfilled, () => false)
    .addCase(fetchWeatherTodayCity2.rejected, () => false);
});

const status_city3 = createReducer(false, builder => {
  builder
    .addCase(fetchWeatherTodayCity2.pending, () => false)
    .addCase(fetchWeatherTodayCity2.fulfilled, () => true)
    .addCase(fetchWeatherTodayCity2.rejected, () => false);
});

const timeUpdate_city3 = createReducer('--:--', builder => {
  builder.addCase(fetchWeatherTodayCity2.fulfilled, () => moment().format('HH:mm'));
});

//

export default combineReducers({
  //
  data_city1,
  loading_city1,
  status_city1,
  timeUpdate_city1,
  //
  data_city2,
  loading_city2,
  status_city2,
  timeUpdate_city2,
  //
  data_city3,
  loading_city3,
  status_city3,
  timeUpdate_city3,
  //
});
