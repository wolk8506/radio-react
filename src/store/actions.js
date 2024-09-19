export const WEATHER_CITY = 'WEATHER_CITY';
export const ADD_WEATHER_CITY = 'ADD_WEATHER_CITY';
// export const WEATHER = 'WEATHER';
export const WEATHER_15 = 'WEATHER_15';
export const WEATHER_LAST_DAY = 'WEATHER_LAST_DAY';
export const CURRENCY_MONO = 'CURRENCY_MONO';
export const NBU_TODAY = 'NBU_TODAY';
export const NBU_TOMORROW = 'NBU_TOMORROW';
export const ZVR_PREVIOUS = 'ZVR_PREVIOUS';
export const ZVR_CURRENT = 'ZVR_CURRENT';
export const LOCATION = 'LOCATION';
export const KURS_TODAY_BANKS = 'KURS_TODAY_BANKS';
export const PLAYER_STATION = 'PLAYER_STATION';
export const CURRENCY_YESTERDAY = 'CURRENCY_YESTERDAY';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const WEATHER_ELEMENTS = 'WEATHER_ELEMENTS';
// PLAYER_STATION

const makeActionCreater = (type, keys) => {
  return (...values) => {
    const payload = {};
    keys.forEach((_, index) => {
      payload[keys[index]] = values[index];
    });
    return {
      type,
      payload,
    };
  };
};

export const playerStation = makeActionCreater(PLAYER_STATION, [
  'playerStation',
]);
export const playerPlay = makeActionCreater(PLAYER_PLAY, ['playerPlay']);

// playPause
export const location = makeActionCreater(LOCATION, ['city']);

export const kursTodayBanks = makeActionCreater(KURS_TODAY_BANKS, ['data']);

export const weatherCity = makeActionCreater(WEATHER_CITY, ['city']);
export const currencyYesterday = makeActionCreater(CURRENCY_YESTERDAY, [
  'currencyYesterday',
]);
export const addWeatherCity = makeActionCreater(ADD_WEATHER_CITY, ['city2']);
// export const weather = makeActionCreater(WEATHER, ['data']);

export const weather_elements = makeActionCreater(WEATHER_ELEMENTS, ['data']);
export const weather_15 = makeActionCreater(WEATHER_15, ['data']);
export const weather_last_day = makeActionCreater(WEATHER_LAST_DAY, ['data']);
export const currencyMonoToday = makeActionCreater(CURRENCY_MONO, ['data']);
export const currencyNBUtoday = makeActionCreater(NBU_TODAY, ['data']);
export const currencyNBUtomorrow = makeActionCreater(NBU_TOMORROW, ['data']);
export const currencyZVRPrevious = makeActionCreater(ZVR_PREVIOUS, ['data']);
export const currencyZVRCurrent = makeActionCreater(ZVR_CURRENT, ['data']);
