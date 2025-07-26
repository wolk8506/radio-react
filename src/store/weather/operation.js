import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const URL_LOCATION = 'https://ipapi.co/json/';

async function fetchData(url) {
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();
  return data;
}

//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ?  - - - - - -   * * * *   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
const fetchLocation = createAsyncThunk('weather/Location', async () => {
  try {
    const response = await axios.get(URL_LOCATION);

    return response.data;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ?  - - - - - -   Погода    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// *    Погода на вчера
//
// const fetchWeatherYesterday = createAsyncThunk('weather/Yesterday', async url => {
//   try {
//     const response = await fetchData(url);
//     return response;
//   } catch (error) {
//     console.log('❌ error');
//   }
// });
//
// *    Погода на сегодня
//
const fetchWeatherToday = createAsyncThunk('weather/Today', async url => {
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
// const fetchWeatherTomorrow = createAsyncThunk('weather/Tomorrow', async url => {
//   try {
//     const response = await fetchData(url);
//     return response;
//   } catch (error) {
//     console.log('❌ error');
//   }
// });
//
// *    Погода на месяц
//
const fetchWeatherMonth = createAsyncThunk('weather/Month', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// *    Погода на Неделю
//
const fetchWeatherWeek = createAsyncThunk('weather/Week', async url => {
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
const fetchWeatherElements = createAsyncThunk('weather/Elements', async url => {
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
const fetchWeatherAirQuality = createAsyncThunk('weather/AirQuality', async url => {
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
const fetchWeatherTodayCity1 = createAsyncThunk('weather/TodayCity1', async url => {
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
const fetchWeatherTodayCity2 = createAsyncThunk('weather/TodayCity2', async url => {
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
const fetchWeatherTodayCity3 = createAsyncThunk('weather/TodayCity3', async url => {
  try {
    const response = await fetchData(url);
    return response;
  } catch (error) {
    console.log('❌ error');
  }
});
//
// ?  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const weatherOperations = {
  fetchLocation,
  // fetchWeatherYesterday,
  fetchWeatherToday,
  // fetchWeatherTomorrow,
  fetchWeatherMonth,
  fetchWeatherWeek,
  fetchWeatherElements,
  fetchWeatherAirQuality,
  fetchWeatherTodayCity1,
  fetchWeatherTodayCity2,
  fetchWeatherTodayCity3,
};
