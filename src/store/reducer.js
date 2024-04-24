import {
  WEATHER_CITY,
  WEATHER,
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
} from './actions';

const initState = {
  playerStation: 0,
  city: null,
};

export const weatherCityReducer = (state = initState, action) => {
  switch (action.type) {
    case WEATHER_CITY: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case PLAYER_STATION: {
      const item = action.payload;
      return { ...state, ...item };
    }
    case LOCATION: {
      const item = action.payload;
      return { ...state, ...{ city: `${item.latitude},${item.longitude}` } };
    }
    default:
      return state;
  }
};

export const kursTodayBanksReducer = (state = [], action) => {
  switch (action.type) {
    case KURS_TODAY_BANKS: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};

export const weatherReducer = (state = [], action) => {
  switch (action.type) {
    case WEATHER: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};

export const weather15Reducer = (state = [], action) => {
  switch (action.type) {
    case WEATHER_15: {
      const items = action.payload;
      return items;
    }
    default:
      return state;
  }
};

export const weatherLastDayReducer = (state = [], action) => {
  switch (action.type) {
    case WEATHER_LAST_DAY: {
      const items = action.payload;
      return items;
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
