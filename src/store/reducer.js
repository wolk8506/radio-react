import {
  WEATHER_CITY,
  CURRENCY_MONO,
  NBU_TODAY,
  NBU_TOMORROW,
  ZVR_PREVIOUS,
  ZVR_CURRENT,
  WEATHER_15,
  WEATHER_LAST_DAY,
  PLAYER_STATION,
  LOCATION,
  KURS_TODAY_BANKS,
  CURRENCY_YESTERDAY,
  PLAYER_PLAY,
  WEATHER_ELEMENTS,
} from './actions';

import {
  initStateWeather15,
  initStateWeatherElements,
  initStateWeatherLastDay,
} from './init-state-mock';

const initState = {
  playerStation: 0,
  city: null,
  playerPlay: false,
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
    default:
      return state;
  }
};

export const kursTodayBanksReducer = (state = [], action) => {
  switch (action.type) {
    case KURS_TODAY_BANKS: {
      const items = action.payload.data.exchangers;
      return items;
    }
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

export const weatherLastDayReducer = (
  state = initStateWeatherLastDay,
  action
) => {
  switch (action.type) {
    case WEATHER_LAST_DAY: {
      const items = action.payload;
      return { ...state, ...items };
    }
    default:
      return state;
  }
};

export const currencyMonoTodayReducer = (state = [], action) => {
  switch (action.type) {
    case CURRENCY_MONO: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};

export const currencyNBUtodayReducer = (state = [], action) => {
  switch (action.type) {
    case NBU_TODAY: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};

export const currencyNBUtomorrowReducer = (state = [], action) => {
  switch (action.type) {
    case NBU_TOMORROW: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};

export const currencyZVRPreviousReducer = (state = [], action) => {
  switch (action.type) {
    case ZVR_PREVIOUS: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};

export const currencyZVRCurrentReducer = (state = [], action) => {
  switch (action.type) {
    case ZVR_CURRENT: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};
