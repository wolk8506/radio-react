import { createAction } from '@reduxjs/toolkit';

const setPlayerStation = createAction('data/playerStation');
const setPlayerPlay = createAction('data/playerPlay');

const setThemeChengeTheme = createAction('data/themeChengeTheme');
const setThemeAutoChengeTheme = createAction('data/themeAutoChengeTheme');
const setThemeChengeWalpaper = createAction('data/themeChengeWalpaper');
const setThemeWalpaper = createAction('data/themeWalpaper');
const setThemeWidgetClock = createAction('data/themeWidgetClock');
const setThemeIconWeather = createAction('data/themeIconWeather');
const setThemeTransporantClock = createAction('data/themeTransporantClock');
const setThemeClock_AnalogDigital = createAction('data/themeClock_AnalogDigital');
const setThemeNewYear = createAction('data/themeNewYear');

export const dataActions = {
  setPlayerStation,
  setPlayerPlay,
  setThemeChengeTheme,
  setThemeAutoChengeTheme,
  setThemeChengeWalpaper,
  setThemeWalpaper,
  setThemeWidgetClock,
  setThemeIconWeather,
  setThemeTransporantClock,
  setThemeClock_AnalogDigital,
  setThemeNewYear,
};
