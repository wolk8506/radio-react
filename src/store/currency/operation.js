import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

async function fetchData(url) {
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();
  return data;
}

// ~  Курс валют Mono bank  -----------------------------------------------------------------------
//
const fetchCurrencyMonoCurrent = createAsyncThunk('currency/MonoCurrent', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// ~  Курс валют НБУ на сегодни -------------------------------------------------------------------
//
const fetchCurrencyNBUtoday = createAsyncThunk('currency/NBUtoday', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// ~  Курс валют НБУ на завтра  -------------------------------------------------------------------
//
const fetchCurrencyNBUtomorrow = createAsyncThunk('currency/NBUtomorrow', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// ~  Золотовалютные резервы за предыдущий месяц  -------------------------------------------------
//
const fetchCurrencyZVRPrevious = createAsyncThunk('currency/ZVRPrevious', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// ~  Золотовалютные резервы за текущий месяц -----------------------------------------------------
//
const fetchCurrencyZVRCurrent = createAsyncThunk('currency/ZVRCurrent', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//

export const currencyOperations = {
  fetchCurrencyMonoCurrent,
  fetchCurrencyNBUtoday,
  fetchCurrencyNBUtomorrow,
  fetchCurrencyZVRPrevious,
  fetchCurrencyZVRCurrent,
};
