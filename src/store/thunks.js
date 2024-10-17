import { requestByURL } from 'api/request';
import {
  LOCATION,
  CURRENCY_MONO,
  // KURS_TODAY_BANKS,
  WEATHER_15,
  WEATHER_ELEMENTS,
  WEATHER_AIR_QUALITY,
  WEATHER_YESTERDAY,
  WEATHER_TODAY,
  WEATHER_TOMORROW,
} from './actions';

const URL_MONO_TODAY = `https://api.monobank.ua/bank/currency`;
const URL_LOCATION = `https://ipapi.co/json/`;
// const URL_KURS_TODAY_BANKS = 'https://apiexpressdata-1z2wmj3x.b4a.run/api/contacts';

// export const getKursTodayBanks = () => {
//   return dispatch => {
//     requestByURL(URL_KURS_TODAY_BANKS).then(data => {
//       dispatch({
//         type: KURS_TODAY_BANKS,
//         payload: data,
//       });
//     });
//   };
// };

export const getLocation = () => {
  return dispatch => {
    requestByURL(URL_LOCATION).then(data => {
      dispatch({
        type: LOCATION,
        payload: data,
      });
    });
  };
};

export const getWeatherElements = URL => {
  return dispatch => {
    requestByURL(URL).then(data => {
      dispatch({
        type: WEATHER_ELEMENTS,
        payload: data,
      });
    });
  };
};

export const getWeather15 = URL_WEATHER15 => {
  return dispatch => {
    requestByURL(URL_WEATHER15).then(data => {
      dispatch({
        type: WEATHER_15,
        payload: data,
      });
    });
  };
};

export const getWeatherAirQuality = URL => {
  return dispatch => {
    requestByURL(URL).then(data => {
      dispatch({
        type: WEATHER_AIR_QUALITY,
        payload: data,
      });
    });
  };
};

export const getWeatherYesterday = URL => {
  return dispatch => {
    requestByURL(URL).then(data => {
      if (data === undefined) return;
      dispatch({
        type: WEATHER_YESTERDAY,
        payload: data,
      });
    });
  };
};

export const getWeatherToday = URL_WEATHER15 => {
  return dispatch => {
    requestByURL(URL_WEATHER15).then(data => {
      if (data === undefined) return;
      dispatch({
        type: WEATHER_TODAY,
        payload: data,
      });
    });
  };
};
export const getWeatherTomorrow = URL => {
  return dispatch => {
    requestByURL(URL).then(data => {
      if (data === undefined) return;
      dispatch({
        type: WEATHER_TOMORROW,
        payload: data,
      });
    });
  };
};

export const getMonoToday = () => {
  return dispatch => {
    requestByURL(URL_MONO_TODAY).then(data => {
      if (data === undefined) return;
      dispatch({
        type: CURRENCY_MONO,
        payload: data,
      });
    });
  };
};
