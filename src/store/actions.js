export const WEATHER_CITY = 'WEATHER_CITY';
export const ADD_WEATHER_CITY = 'ADD_WEATHER_CITY';
export const LOCATION = 'LOCATION';
export const PLAYER_STATION = 'PLAYER_STATION';
export const CURRENCY_YESTERDAY = 'CURRENCY_YESTERDAY';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const THEME_CHANGE = 'THEME_CHANGE';
export const THEME_AUTO_CHANGE = 'THEME_AUTO_CHANGE';
// export const KURS_TODAY_BANKS = 'KURS_TODAY_BANKS';
// export const KURS_TODAY_BANKS_STATUS = 'KURS_TODAY_BANKS_STATUS';
export const CURRENCY_MONO = 'CURRENCY_MONO';
export const CURRENCY_MONO_STATUS = 'CURRENCY_MONO_STATUS';
export const WEATHER_15 = 'WEATHER_15';
export const WEATHER_LAST_DAY = 'WEATHER_LAST_DAY';
export const WEATHER_ELEMENTS = 'WEATHER_ELEMENTS';
export const WEATHER_AIR_QUALITY = 'WEATHER_AIR_QUALITY';
export const WEATHER_YESTERDAY = 'WEATHER_YESTERDAY';
export const WEATHER_TODAY = 'WEATHER_TODAY';
export const WEATHER_TOMORROW = 'WEATHER_TOMORROW';

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

export const changeThemeAuto = makeActionCreater(THEME_AUTO_CHANGE, ['themeAutoChange']);
export const changeTheme = makeActionCreater(THEME_CHANGE, ['theme']);
export const playerStation = makeActionCreater(PLAYER_STATION, ['playerStation']);
export const playerPlay = makeActionCreater(PLAYER_PLAY, ['playerPlay']);
export const location = makeActionCreater(LOCATION, ['city']);
// export const kursTodayBanks = makeActionCreater(KURS_TODAY_BANKS, ['data']);
// export const kursTodayBanksStatus = makeActionCreater(KURS_TODAY_BANKS_STATUS, ['status']);
export const weatherCity = makeActionCreater(WEATHER_CITY, ['city']);
export const currencyYesterday = makeActionCreater(CURRENCY_YESTERDAY, ['currencyYesterday']);
export const addWeatherCity = makeActionCreater(ADD_WEATHER_CITY, ['city2']);

// !  Weather
export const weather_elements = makeActionCreater(WEATHER_ELEMENTS, ['data']);
export const weather_15 = makeActionCreater(WEATHER_15, ['data']);
export const weather_AirQuality = makeActionCreater(WEATHER_AIR_QUALITY, ['data']);
export const weather_yesterday = makeActionCreater(WEATHER_YESTERDAY, ['yesterday']);
export const weather_today = makeActionCreater(WEATHER_TODAY, ['today']);
export const weather_tomorrow = makeActionCreater(WEATHER_TOMORROW, ['tomorrow']);
// !  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const currencyMonoToday = makeActionCreater(CURRENCY_MONO, ['data']);
export const currencyMonoTodayStatus = makeActionCreater(CURRENCY_MONO_STATUS, ['status']);
