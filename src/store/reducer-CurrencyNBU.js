import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchCurrencyNBUtoday, fetchCurrencyNBUtomorrow } from './operation';
import {
  initStateCurrencyNBUtoday as initState_NBUtoday,
  initStateCurrencyNBUtomorrow as initState_NBUtomorrow,
} from './init-state-mock';
import moment from 'moment';

const data_today = createReducer(initState_NBUtoday, builder => {
  builder.addCase(fetchCurrencyNBUtoday.fulfilled, (state, action) => action.payload);
});

const loading_today = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyNBUtoday.pending, () => true)
    .addCase(fetchCurrencyNBUtoday.fulfilled, () => false)
    .addCase(fetchCurrencyNBUtoday.rejected, () => false);
});

const status_today = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyNBUtoday.pending, () => false)
    .addCase(fetchCurrencyNBUtoday.fulfilled, () => true)
    .addCase(fetchCurrencyNBUtoday.rejected, () => false);
});

const timeUpdate_today = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchCurrencyNBUtoday.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

//

const data_tomorrow = createReducer(initState_NBUtomorrow, builder => {
  builder.addCase(fetchCurrencyNBUtomorrow.fulfilled, (state, action) => action.payload);
});

const loading_tomorrow = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyNBUtomorrow.pending, () => true)
    .addCase(fetchCurrencyNBUtomorrow.fulfilled, () => false)
    .addCase(fetchCurrencyNBUtomorrow.rejected, () => false);
});

const status_tomorrow = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyNBUtomorrow.pending, () => false)
    .addCase(fetchCurrencyNBUtomorrow.fulfilled, () => true)
    .addCase(fetchCurrencyNBUtomorrow.rejected, () => false);
});

const timeUpdate_tomorrow = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchCurrencyNBUtomorrow.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

export default combineReducers({
  data_today,
  loading_today,
  status_today,
  timeUpdate_today,
  data_tomorrow,
  loading_tomorrow,
  status_tomorrow,
  timeUpdate_tomorrow,
});
