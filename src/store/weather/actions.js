import { createAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const setCityName = createAction('data/city');
const addCityListItem = createAction('data/addCityListItem', ({ city, favorite, home, icon, temperature }) => ({
  payload: { id: nanoid(5), city, favorite, home, icon, temperature },
}));
const prependCityListItem = createAction('data/prependCityListItem', ({ city, favorite, home, icon, temperature }) => ({
  payload: { id: nanoid(5), city, favorite, home, icon, temperature },
}));
const deleteCityListItem = createAction('data/deleteCityListItem');
const homeCityListItem = createAction('data/homeCityListItem');
const setCityList = createAction('data/setCityList', list => ({ payload: list }));
const setCitiesWeather = createAction('data/setCitiesWeather', map => ({ payload: map }));

export const weatherActions = {
  setCityName,
  addCityListItem,
  prependCityListItem,
  deleteCityListItem,
  homeCityListItem,
  setCityList,
  setCitiesWeather,
};
