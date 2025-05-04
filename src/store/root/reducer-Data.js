import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import {
  setPlayerStation,
  setPlayerPlay,
  setCurrencyYesterday,
  setThemeChengeTheme,
  setThemeAutoChengeTheme,
  setThemeChengeWalpaper,
  setThemeWidgetClock,
  setThemeIconWeather,
  setThemeTransporantClock,
  setThemeClock_AnalogDigital,
  setThemeNewYear,
  setCityName,
  addCityListItem,
  deleteCityListItem,
  homeCityListItem,
} from './actions';
import { dataActions } from './actions';
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
const themeWalpaper = createReducer(null, builder => {
  builder.addCase(dataActions.setThemeWalpaper, (state, action) => action.payload);
});
const city = createReducer(null, builder => {
  builder.addCase(setCityName, (state, action) => action.payload);
  builder.addCase(fetchLocation.fulfilled, (state, action) => `${action.payload.city}, ${action.payload.country_name}`);
});
const cityList = createReducer([], builder => {
  builder.addCase(addCityListItem, (state, action) => [...state, action.payload]);
  builder.addCase(deleteCityListItem, (state, action) => state.filter(({ id }) => id !== action.payload));
  builder.addCase(homeCityListItem, (state, action) =>
    state.forEach(function (element) {
      element.home = false;
      if (element.id === action.payload.id) {
        element.home = action.payload.home;
      }
    })
  );
});
const themeWidgetClock = createReducer('0', builder => {
  builder.addCase(setThemeWidgetClock, (state, action) => action.payload);
});
const themeIconWeather = createReducer('0', builder => {
  builder.addCase(setThemeIconWeather, (state, action) => action.payload);
});
const themeTransporantClock = createReducer('100%', builder => {
  builder.addCase(setThemeTransporantClock, (state, action) => action.payload);
});
const themeClock_AnalogDigital = createReducer(true, builder => {
  builder.addCase(setThemeClock_AnalogDigital, (state, action) => action.payload);
});
const themeNewYear = createReducer(
  {
    snow: false,
    timer: false,
    sugrob: false,
    blueWhiteIgloo: false,
    snowMan: false,
    christmasTree: false,
    pole: false,
    santaSleigh: false,
    year: false,
    snake: false,
  },
  builder => {
    builder.addCase(setThemeNewYear, (state, action) => action.payload);
  }
);

export default combineReducers({
  playerStation,
  playerPlay,
  currencyYesterday,
  themeChengeTheme,
  themeAutoChengeTheme,
  themeChengeWalpaper,
  themeWidgetClock,
  themeIconWeather,
  themeTransporantClock,
  themeClock_AnalogDigital,
  themeNewYear,
  city,
  cityList,
  themeWalpaper,
});
