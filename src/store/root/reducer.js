import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { dataActions } from 'store';

const playerStation = createReducer(0, builder => {
  builder.addCase(dataActions.setPlayerStation, (state, action) => action.payload);
});
const playerPlay = createReducer(false, builder => {
  builder.addCase(dataActions.setPlayerPlay, (state, action) => action.payload);
});

const themeChengeTheme = createReducer('shadow-ember', builder => {
  builder.addCase(dataActions.setThemeChengeTheme, (state, action) => action.payload);
});
const themeAutoChengeTheme = createReducer(true, builder => {
  builder.addCase(dataActions.setThemeAutoChengeTheme, (state, action) => action.payload);
});
const themeChengeWalpaper = createReducer('linear-gradient(90deg, var(--color-06), var(--color-06))', builder => {
  builder.addCase(dataActions.setThemeChengeWalpaper, (state, action) => action.payload);
});
const themeWalpaper = createReducer(null, builder => {
  builder.addCase(dataActions.setThemeWalpaper, (state, action) => action.payload);
});
const themeWidgetClock = createReducer('0', builder => {
  builder.addCase(dataActions.setThemeWidgetClock, (state, action) => action.payload);
});
const themeIconWeather = createReducer('0', builder => {
  builder.addCase(dataActions.setThemeIconWeather, (state, action) => action.payload);
});
const themeTransporantClock = createReducer('100%', builder => {
  builder.addCase(dataActions.setThemeTransporantClock, (state, action) => action.payload);
});
const themeClock_AnalogDigital = createReducer(true, builder => {
  builder.addCase(dataActions.setThemeClock_AnalogDigital, (state, action) => action.payload);
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
    builder.addCase(dataActions.setThemeNewYear, (state, action) => action.payload);
  }
);

export default combineReducers({
  playerStation,
  playerPlay,
  themeChengeTheme,
  themeAutoChengeTheme,
  themeChengeWalpaper,
  themeWidgetClock,
  themeIconWeather,
  themeTransporantClock,
  themeClock_AnalogDigital,
  themeNewYear,
  themeWalpaper,
});
