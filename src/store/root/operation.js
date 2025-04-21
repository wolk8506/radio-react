import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const URL_LOCATION = 'https://ipapi.co/json/';

//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ?  - - - - - -   * * * *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
export const fetchLocation = createAsyncThunk('weather/Location', async () => {
  try {
    const response = await axios.get(URL_LOCATION);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ?  - - - - - -   Погода    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
async function fetchData(url) {
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();
  return data;
}

// export const fetchWeatherMonth = createAsyncThunk('weather/Month', async url => {
//   const response = await fetchData(url);
//   console.log(data);
// });

// *    Погода на вчера
//
export const fetchWeatherYesterday = createAsyncThunk('weather/Yesterday', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода на сегодня
//
export const fetchWeatherToday = createAsyncThunk('weather/Today', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода на завтра
//
export const fetchWeatherTomorrow = createAsyncThunk('weather/Tomorrow', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода на месяц
//
export const fetchWeatherMonth = createAsyncThunk('weather/Month', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода Луна / фаза Луны / Солнце
//
export const fetchWeatherElements = createAsyncThunk('weather/Elements', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода качество воздуха
//
export const fetchWeatherAirQuality = createAsyncThunk('weather/AirQuality', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода на сегодня город 1
//
export const fetchWeatherTodayCity1 = createAsyncThunk('weather/TodayCity1', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода на сегодня город 2
//
export const fetchWeatherTodayCity2 = createAsyncThunk('weather/TodayCity2', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода на сегодня город 3
//
export const fetchWeatherTodayCity3 = createAsyncThunk('weather/TodayCity3', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
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
    console.log('❌ error');
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
    console.log('❌ error');
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
    console.log('❌ error');
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
    console.log('❌ error');
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
    console.log('❌ error');
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
    console.log('❌ error');
  }
});
//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ?  - - - - - -   Новости   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// *    Новости
//
export const fetchNews = createAsyncThunk('news', async url => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('❌ error', error.response.status, ' ', error.response.statusText);
  }
});
//
