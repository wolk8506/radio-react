export const WEATHER_CITY = 'WEATHER_CITY';
export const ADD_WEATHER_CITY = 'ADD_WEATHER_CITY';
export const LOCATION = 'LOCATION';
export const PLAYER_STATION = 'PLAYER_STATION';
export const CURRENCY_YESTERDAY = 'CURRENCY_YESTERDAY';
export const PLAYER_PLAY = 'PLAYER_PLAY';
export const THEME_CHANGE = 'THEME_CHANGE';
export const THEME_AUTO_CHANGE = 'THEME_AUTO_CHANGE';
export const THEME_CHANGE_BACKGROUND = 'THEME_CHANGE_BACKGROUND';
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
export const changeThemeBackground = makeActionCreater(THEME_CHANGE_BACKGROUND, ['themeBackground']);

export const playerStation = makeActionCreater(PLAYER_STATION, ['playerStation']);
export const playerPlay = makeActionCreater(PLAYER_PLAY, ['playerPlay']);
export const location = makeActionCreater(LOCATION, ['city']);
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
