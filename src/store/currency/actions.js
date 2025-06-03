import { createAction } from '@reduxjs/toolkit';

export const setCurrencyYesterday = createAction('data/cCurrencyYesterday');

export const currencyActions = {
  setCurrencyYesterday,
};
