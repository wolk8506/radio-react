// import { createReducer } from '@reduxjs/toolkit';
// import { combineReducers } from 'redux';
// import { fetchCurrencyBanksToday } from './operation';
// import { initStateCurrencyBanksToday as initState } from './init-state-mock';
// import moment from 'moment';

// const data = createReducer(initState, builder => {
//   builder.addCase(fetchCurrencyBanksToday.fulfilled, (state, action) => action.payload);
// });

// const loading = createReducer(false, builder => {
//   builder
//     .addCase(fetchCurrencyBanksToday.pending, () => true)
//     .addCase(fetchCurrencyBanksToday.fulfilled, () => false)
//     .addCase(fetchCurrencyBanksToday.rejected, () => false);
// });

// const status = createReducer(false, builder => {
//   builder
//     .addCase(fetchCurrencyBanksToday.pending, () => false)
//     .addCase(fetchCurrencyBanksToday.fulfilled, () => true)
//     .addCase(fetchCurrencyBanksToday.rejected, () => false);
// });

// const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
//   builder.addCase(fetchCurrencyBanksToday.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
// });

// export default combineReducers({
//   data,
//   loading,
//   status,
//   timeUpdate,
// });
