import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchCurrencyMonoCurrent } from './operation';
import { initStateCurrencyMonoCurrent as initState } from './init-state-mock';
import moment from 'moment';

const data = createReducer(initState, builder => {
  builder.addCase(fetchCurrencyMonoCurrent.fulfilled, (state, action) => action.payload);
});

const loading = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyMonoCurrent.pending, () => true)
    .addCase(fetchCurrencyMonoCurrent.fulfilled, () => false)
    .addCase(fetchCurrencyMonoCurrent.rejected, () => false);
});

const status = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyMonoCurrent.pending, () => false)
    .addCase(fetchCurrencyMonoCurrent.fulfilled, () => true)
    .addCase(fetchCurrencyMonoCurrent.rejected, () => false);
});

const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchCurrencyMonoCurrent.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

export default combineReducers({
  data,
  loading,
  status,
  timeUpdate,
});
