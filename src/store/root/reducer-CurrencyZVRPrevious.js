import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchCurrencyZVRPrevious } from './operation';
import { initStateCurrencyZVRPrevious as initState } from './init-state-mock';
import moment from 'moment';

const data = createReducer(initState, builder => {
  builder.addCase(fetchCurrencyZVRPrevious.fulfilled, (state, action) => action.payload);
});

const loading = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyZVRPrevious.pending, () => true)
    .addCase(fetchCurrencyZVRPrevious.fulfilled, () => false)
    .addCase(fetchCurrencyZVRPrevious.rejected, () => false);
});

const status = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyZVRPrevious.pending, () => false)
    .addCase(fetchCurrencyZVRPrevious.fulfilled, () => true)
    .addCase(fetchCurrencyZVRPrevious.rejected, () => false);
});

const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchCurrencyZVRPrevious.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

export default combineReducers({
  data,
  loading,
  status,
  timeUpdate,
});
