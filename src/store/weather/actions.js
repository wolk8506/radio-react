import { createAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const setCityName = createAction('data/city');
const addCityListItem = createAction('data/addCityListItem', ({ city, favorite, home, icon, temperature }) => ({
  payload: { id: nanoid(5), city, favorite, home, icon, temperature },
}));
const deleteCityListItem = createAction('data/deleteCityListItem');
const homeCityListItem = createAction('data/homeCityListItem');

export const weatherActions = {
  setCityName,
  addCityListItem,
  deleteCityListItem,
  homeCityListItem,
};
