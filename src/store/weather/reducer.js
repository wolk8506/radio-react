import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { weatherOperations, weatherActions } from 'store';
import {
  initStateWeatherAirQuality,
  initStateWeatherDay,
  initStateWeatherMonth,
  initStateWeatherElements,
} from './init-state-mock';

import moment from 'moment';

const initState_WeatherAirQuality = {
  data: initStateWeatherAirQuality,
  loading: false,
  status: true,
  timeUpdate: '----.--.-- --:--:--',
};

const initState_WeatherDay = {
  data: initStateWeatherDay,
  loading: false,
  status: true,
  error: false,
  timeUpdate: '--:--',
};

const initState_WeatherElements = {
  data: initStateWeatherElements,
  loading: false,
  status: true,
  timeUpdate: '--:--',
};

const initState_WeatherMonth = {
  data: initStateWeatherMonth,
  loading: false,
  status: true,
  timeUpdate: '--:--',
};

const weatherAirQuality = createReducer(initState_WeatherAirQuality, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherAirQuality.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.timeUpdate = moment().format('YYYY.MM.DD HH:mm:ss');
    })
    .addCase(weatherOperations.fetchWeatherAirQuality.pending, (state, action) => {
      state.loading = true;
      state.status = false;
    })
    .addCase(weatherOperations.fetchWeatherAirQuality.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
    });
});

const weatherYesterday = createReducer(initState_WeatherDay, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherToday.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherYesterday.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherYesterday.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const weatherToday = createReducer(initState_WeatherDay, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherToday.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherToday.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherToday.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const weatherTomorrow = createReducer(initState_WeatherDay, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherTomorrow.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherTomorrow.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherTomorrow.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const weatherCity1 = createReducer(initState_WeatherDay, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherTodayCity1.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherTodayCity1.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherTodayCity1.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const weatherCity2 = createReducer(initState_WeatherDay, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherTodayCity2.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherTodayCity2.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherTodayCity2.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const weatherCity3 = createReducer(initState_WeatherDay, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherTodayCity3.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherTodayCity3.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherTodayCity3.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const weatherElements = createReducer(initState_WeatherElements, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherElements.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherElements.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherElements.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const weatherMonth = createReducer(initState_WeatherMonth, builder => {
  builder
    .addCase(weatherOperations.fetchWeatherMonth.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.error = false;
      state.timeUpdate = moment().format('HH:mm');
    })
    .addCase(weatherOperations.fetchWeatherMonth.pending, (state, action) => {
      state.loading = true;
      state.status = false;
      state.error = false;
    })
    .addCase(weatherOperations.fetchWeatherMonth.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = true;
    });
});

const city = createReducer(null, builder => {
  builder.addCase(weatherActions.setCityName, (state, action) => action.payload);
  builder.addCase(
    weatherOperations.fetchLocation.fulfilled,
    (state, action) => `${action.payload.city}, ${action.payload.country_name}`
  );
});

const cityList = createReducer([], builder => {
  builder.addCase(weatherActions.addCityListItem, (state, action) => [...state, action.payload]);
  builder.addCase(weatherActions.deleteCityListItem, (state, action) =>
    state.filter(({ id }) => id !== action.payload)
  );
  builder.addCase(weatherActions.homeCityListItem, (state, action) =>
    state.forEach(function (element) {
      element.home = false;
      if (element.id === action.payload.id) {
        element.home = action.payload.home;
      }
    })
  );
});

export default combineReducers({
  weatherAirQuality,
  weatherYesterday,
  weatherToday,
  weatherTomorrow,
  weatherCity1,
  weatherCity2,
  weatherCity3,
  weatherElements,
  weatherMonth,
  city,
  cityList,
});
