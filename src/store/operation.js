import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// ?  - - - - - -   Погода    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// *    Погода
//
export const fetchWeatherYesterday = createAsyncThunk('weather/Yesterday', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Погода
//
export const fetchWeatherToday = createAsyncThunk('weather/Today', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Погода
//
export const fetchWeatherTomorrow = createAsyncThunk('weather/Tomorrow', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Погода
//
export const fetchWeatherMonth = createAsyncThunk('weather/Month', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Погода
//
export const fetchWeatherElements = createAsyncThunk('weather/Elements', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Погода
//
export const fetchWeatherAirQuality = createAsyncThunk('weather/AirQuality', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ?  - - - - - -   Курс валют  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// *    Курс валют Mono bank
//
export const fetchCurrencyMonoCurrent = createAsyncThunk('currency/MonoCurrent', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Курс валют в банках на сегодня
//
export const fetchCurrencyBanksToday = createAsyncThunk('currency/BanksToday', async url => {
  try {
    const response = await axios.get(url);
    return response.data.data.exchangers;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Курс валют НБУ на сегодни
//
export const fetchCurrencyNBUtoday = createAsyncThunk('currency/NBUtoday', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Курс валют НБУ на завтра
//
export const fetchCurrencyNBUtomorrow = createAsyncThunk('currency/NBUtomorrow', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Золотовалютные резервы за предыдущий месяц
//
export const fetchCurrencyZVRPrevious = createAsyncThunk('currency/ZVRPrevious', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
//
// *    Золотовалютные резервы за текущий месяц
//
export const fetchCurrencyZVRCurrent = createAsyncThunk('currency/ZVRCurrent', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('error');
  }
});
