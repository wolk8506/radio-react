import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchCurrencyZVRCurrent } from './operation';
import { initStateCurrencyZVRCurrent as initState } from './init-state-mock';
import moment from 'moment';

const data = createReducer(initState, builder => {
  builder.addCase(fetchCurrencyZVRCurrent.fulfilled, (state, action) => action.payload);
});

const loading = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyZVRCurrent.pending, () => true)
    .addCase(fetchCurrencyZVRCurrent.fulfilled, () => false)
    .addCase(fetchCurrencyZVRCurrent.rejected, () => false);
});

const status = createReducer(false, builder => {
  builder
    .addCase(fetchCurrencyZVRCurrent.pending, () => false)
    .addCase(fetchCurrencyZVRCurrent.fulfilled, () => true)
    .addCase(fetchCurrencyZVRCurrent.rejected, () => false);
});

const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
  builder.addCase(fetchCurrencyZVRCurrent.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
});

export default combineReducers({
  data,
  loading,
  status,
  timeUpdate,
});
