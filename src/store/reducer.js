import {
  CURRENCY_MONO,
  PLAYER_STATION,
  LOCATION,
  // KURS_TODAY_BANKS,
  CURRENCY_YESTERDAY,
  PLAYER_PLAY,
  THEME_CHANGE,
  THEME_AUTO_CHANGE,
  // KURS_TODAY_BANKS_STATUS,
  CURRENCY_MONO_STATUS,
  WEATHER_AIR_QUALITY,
  WEATHER_YESTERDAY,
  WEATHER_TODAY,
  WEATHER_TOMORROW,
  WEATHER_ELEMENTS,
  WEATHER_15,
  WEATHER_CITY,
} from './actions';

import {
  initStateWeather15,
  initStateWeatherElements,
  initStateWeatherLastDay,
  // initStateCurrencyBanksToday,
  initStateCurrencyMonoCurrent,
  initStateWeatherAirQuality,
} from './init-state-mock';

import moment from 'moment';

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
    default:
      return state;
  }
};

// export const kursTodayBanksReducer = (state = initStateCurrencyBanksToday, action) => {
//   switch (action.type) {
//     case KURS_TODAY_BANKS: {
//       const items = action.payload.data.exchangers;
//       const dateNow = moment().format('YYYY.MM.DD HH.mm.ss');
//       return {
//         ...state,
//         ...{
//           data: items,
//           time: dateNow,
//           status: true,
//         },
//       };
//     }
//     case KURS_TODAY_BANKS_STATUS: {
//       const item = action.payload;
//       return {
//         ...state,
//         ...item,
//       };
//     }
//     default:
//       return state;
//   }
// };

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

export const currencyMonoTodayReducer = (state = initStateCurrencyMonoCurrent, action) => {
  switch (action.type) {
    case CURRENCY_MONO: {
      const items = action.payload;
      const dateNow = moment().format('YYYY.MM.DD HH.mm.ss');
      return {
        ...state,
        ...{
          data: items,
          time: dateNow,
          status: true,
        },
      };
    }
    case CURRENCY_MONO_STATUS: {
      const item = action.payload;
      return {
        ...state,
        ...item,
      };
    }
    default:
      return state;
  }
};
