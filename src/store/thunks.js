import { requestByURL } from 'api/request';
import {
  // WEATHER,
  CURRENCY_MONO,
  NBU_TODAY,
  NBU_TOMORROW,
  ZVR_PREVIOUS,
  ZVR_CURRENT,
  WEATHER_15,
  // WEATHER_LAST_DAY,
  LOCATION,
  KURS_TODAY_BANKS,
  WEATHER_ELEMENTS,
  WEATHER_AIR_QUALITY,
  WEATHER_YESTERDAY,
  WEATHER_TODAY,
  WEATHER_TOMORROW,
} from './actions';

import moment from 'moment';
moment().locale('ru');

let dateTomorrow = '';
const dateToday = moment().format('YYYYMMDD');
// const monthPrevious = moment().add(-1, 'months').format('YYYYMM');
const monthCurrent = moment().format('YYYYMM');

switch (moment().format('dddd')) {
  case 'Friday':
    dateTomorrow = moment().add(3, 'days').format('YYYYMMDD');
    break;
  case 'пятница':
    dateTomorrow = moment().add(3, 'days').format('YYYYMMDD');
    break;
  case 'суббота':
    dateTomorrow = moment().add(2, 'days').format('YYYYMMDD');
    break;
  default:
    dateTomorrow = moment().add(1, 'days').format('YYYYMMDD');
    break;
}

const URL_MONO_TODAY = `https://api.monobank.ua/bank/currency`;
const URL_NBU_TODAY = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateToday}&json`;
const URL_NBU_TOMORROW = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateTomorrow}&json`;
// const URL_ZVR_PREVIOUS = `https://bank.gov.ua/NBUStatService/v1/statdirectory/res?date=${monthPrevious}&json`;
const URL_ZVR_CURRENT = `https://bank.gov.ua/NBUStatService/v1/statdirectory/res?date=${monthCurrent}&json`;
const URL_LOCATION = `https://ipapi.co/json/`;
const URL_KURS_TODAY_BANKS = 'https://apiexpressdata-1z2wmj3x.b4a.run/api/contacts';

// kursTodayBanks,

export const getKursTodayBanks = () => {
  return dispatch => {
    requestByURL(URL_KURS_TODAY_BANKS).then(data => {
      dispatch({
        type: KURS_TODAY_BANKS,
        payload: data,
      });
    });
  };
};

// export const getPlayerStation = () => {
//   return dispatch => {
//     requestByURL(URL_LOCATION).then(data => {
//       dispatch({
//         type: LOCATION,
//         payload: data,
//       });
//     });
//   };
// };

export const getLocation = () => {
  return dispatch => {
    requestByURL(URL_LOCATION).then(data => {
      // console.log(data);
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
      // console.log('URL_MONO_TODAY', data);
      if (data === undefined) return;
      dispatch({
        type: CURRENCY_MONO,
        payload: data,
      });
    });
  };
};

export const getNBUtoday = () => {
  return dispatch => {
    requestByURL(URL_NBU_TODAY).then(data => {
      dispatch({
        type: NBU_TODAY,
        payload: data,
      });
    });
  };
};

export const getNBUtomorrow = () => {
  return dispatch => {
    requestByURL(URL_NBU_TOMORROW).then(data => {
      dispatch({
        type: NBU_TOMORROW,
        payload: data,
      });
    });
  };
};

// `https://bank.gov.ua/NBUStatService/v1/statdirectory/res?date=${monthPrevious}&json`

// export const getZVRPrevious = () => {
//   return dispatch => {
//     requestByURL(URL_ZVR_PREVIOUS).then(data => {
//       dispatch({
//         type: ZVR_PREVIOUS,
//         payload: data,
//       });
//     });
//   };
// };

export const getZVRPrevious = URL => {
  return dispatch => {
    requestByURL(URL).then(data => {
      dispatch({
        type: ZVR_PREVIOUS,
        payload: data,
      });
    });
  };
};

export const getZVRCurrent = () => {
  return dispatch => {
    requestByURL(URL_ZVR_CURRENT).then(data => {
      dispatch({
        type: ZVR_CURRENT,
        payload: data,
      });
    });
  };
};
