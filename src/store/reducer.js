import {
  PLAYER_STATION,
  LOCATION,
  CURRENCY_YESTERDAY,
  PLAYER_PLAY,
  THEME_CHANGE,
  THEME_AUTO_CHANGE,
  WEATHER_AIR_QUALITY,
  WEATHER_YESTERDAY,
  WEATHER_TODAY,
  WEATHER_TOMORROW,
  WEATHER_ELEMENTS,
  WEATHER_15,
  WEATHER_CITY,
  THEME_CHANGE_BACKGROUND,
} from './actions';

import {
  initStateWeather15,
  initStateWeatherElements,
  initStateWeatherLastDay,
  initStateWeatherAirQuality,
} from './init-state-mock';

const initState = {
  playerStation: 0,
  city: null,
  playerPlay: false,
  themeAutoChange: true,
};

export const data = (state = initState, action) => {
  switch (action.type) {
    case WEATHER_CITY: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case CURRENCY_YESTERDAY: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case PLAYER_STATION: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case PLAYER_PLAY: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case LOCATION: {
      const item = action.payload;
      return { ...state, ...{ city: item.city } };
    }
    case THEME_CHANGE: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case THEME_AUTO_CHANGE: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case THEME_CHANGE_BACKGROUND: {
      const item = action.payload;
      return { ...state, ...item };
    }

    // THEME_CHANGE_BACKGROUND
    default:
      return state;
  }
};

export const weatherElements = (state = initStateWeatherElements, action) => {
  switch (action.type) {
    case WEATHER_ELEMENTS: {
      const items = action.payload;
      return { ...state, ...items };
    }
    default:
      return state;
  }
};

export const weather15Reducer = (state = initStateWeather15, action) => {
  switch (action.type) {
    case WEATHER_15: {
      const items = action.payload;
      return { ...state, ...items };
    }
    default:
      return state;
  }
};

export const weatherAirQualityReducer = (state = initStateWeatherAirQuality, action) => {
  switch (action.type) {
    case WEATHER_AIR_QUALITY: {
      const items = action.payload;
      return { ...state, ...items };
    }
    default:
      return state;
  }
};

export const weatherLastDayReducer = (state = initStateWeatherLastDay, action) => {
  switch (action.type) {
    case WEATHER_YESTERDAY: {
      const items = action.payload;
      return { ...state, ...{ yesterday: items } };
    }
    case WEATHER_TODAY: {
      const items = action.payload;
      return { ...state, ...{ today: items } };
    }
    case WEATHER_TOMORROW: {
      const items = action.payload;
      return { ...state, ...{ tomorrow: items } };
    }
    default:
      return state;
  }
};
