import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import {
  setPlayerStation,
  setPlayerPlay,
  setCurrencyYesterday,
  setThemeChengeTheme,
  setThemeAutoChengeTheme,
  setThemeChengeWalpaper,
  setCityName,
} from './actions';
import { fetchLocation } from './operation';

import { initStateCurrencyYesterday } from './init-state-mock';

// const data = createReducer(initState, builder => {
//   builder.addCase(fetchLocation.fulfilled, (state, action) => action.payload);
// });

const playerStation = createReducer(0, builder => {
  builder.addCase(setPlayerStation, (state, action) => action.payload);
});
const playerPlay = createReducer(false, builder => {
  builder.addCase(setPlayerPlay, (state, action) => action.payload);
});
const currencyYesterday = createReducer(initStateCurrencyYesterday, builder => {
  builder.addCase(setCurrencyYesterday, (state, action) => action.payload);
});
const themeChengeTheme = createReducer('dark', builder => {
  builder.addCase(setThemeChengeTheme, (state, action) => action.payload);
});
const themeAutoChengeTheme = createReducer(true, builder => {
  builder.addCase(setThemeAutoChengeTheme, (state, action) => action.payload);
});
const themeChengeWalpaper = createReducer('color', builder => {
  builder.addCase(setThemeChengeWalpaper, (state, action) => action.payload);
});
const city = createReducer(null, builder => {
  builder.addCase(setCityName, (state, action) => action.payload);
  builder.addCase(fetchLocation.fulfilled, (state, action) => action.payload.city);
});

export default combineReducers({
  playerStation,
  playerPlay,
  currencyYesterday,
  themeChengeTheme,
  themeAutoChengeTheme,
  themeChengeWalpaper,
  city,
});
