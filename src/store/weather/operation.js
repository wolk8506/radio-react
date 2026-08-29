import axios from 'axios';
import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';

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
//
// *    Избранные города (сохраняются на бэкенде, привязаны к пользователю)
//
const mapCities = cities =>
  (cities || []).map(c => ({
    id: nanoid(5),
    city: c.city,
    home: c.home,
    favorite: c.favorite,
    lat: c.lat ?? null,
    lon: c.lon ?? null,
    icon: '',
    temperature: '',
  }));

async function geocodeCity(city) {
  try {
    const r = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=ru&format=json`,
      { mode: 'cors' }
    );
    const data = await r.json();
    if (data.results && data.results[0]) {
      return { lat: data.results[0].latitude, lon: data.results[0].longitude };
    }
  } catch (e) {
    console.log('❌ geocode error', e);
  }
  return { lat: null, lon: null };
}

const fetchCitiesWeather = createAsyncThunk(
  'weather/fetchCitiesWeather',
  async (cities, thunkAPI) => {
    try {
      const map = {};
      await Promise.all(
        (cities || []).map(async c => {
          if (!c.id) return;
          let { lat, lon } = c;
          if (lat == null || lon == null) {
            const coords = await geocodeCity(c.city);
            lat = coords.lat;
            lon = coords.lon;
          }
          if (lat == null || lon == null) return;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`;
          const r = await fetch(url, { mode: 'cors' });
          const data = await r.json();
          if (!data.current) return;
          map[c.id] = {
            id: c.id,
            temperature: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
            isDay: data.current.is_day === 1,
          };
        })
      );
      return map;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const fetchUserCities = createAsyncThunk('weather/fetchUserCities', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/user/cities');
    return mapCities(data.data.cities);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const addUserCity = createAsyncThunk('weather/addUserCity', async (cityObj, thunkAPI) => {
  try {
    const { data } = await axios.post('/user/cities', cityObj);
    return mapCities(data.data.cities);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const removeUserCity = createAsyncThunk('weather/removeUserCity', async (city, thunkAPI) => {
  try {
    const { data } = await axios.delete(`/user/cities/${encodeURIComponent(city)}`);
    return mapCities(data.data.cities);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const setHomeUserCity = createAsyncThunk(
  'weather/setHomeUserCity',
  async ({ city, home }, thunkAPI) => {
    try {
      const { data } = await axios.patch(`/user/cities/${encodeURIComponent(city)}/home`, { home });
      return mapCities(data.data.cities);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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
  fetchUserCities,
  addUserCity,
  removeUserCity,
  setHomeUserCity,
  fetchCitiesWeather,
};
