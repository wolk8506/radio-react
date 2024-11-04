import { createAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export const setPlayerStation = createAction('data/playerStation');
export const setPlayerPlay = createAction('data/playerPlay');
export const setCurrencyYesterday = createAction('data/cCurrencyYesterday');
export const setThemeChengeTheme = createAction('data/themeChengeTheme');
export const setThemeAutoChengeTheme = createAction('data/themeAutoChengeTheme');
export const setThemeChengeWalpaper = createAction('data/themeChengeWalpaper');
export const setCityName = createAction('data/city');
export const setThemeWidgetClock = createAction('data/themeWidgetClock');
export const setThemeTransporantClock = createAction('data/themeTransporantClock');
export const setThemeClock_AnalogDigital = createAction('data/themeClock_AnalogDigital');
//
export const addCityListItem = createAction('data/addCityListItem', ({ city, favorite, home, icon, temperature }) => ({
  payload: { id: nanoid(5), city, favorite, home, icon, temperature },
}));
export const deleteCityListItem = createAction('data/deleteCityListItem');
export const homeCityListItem = createAction('data/homeCityListItem');
//
