import * as React from 'react';
import Media from 'react-media';
import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getWeatherToday_Data, getCityName } from 'store/selectors';
import {
  fetchWeatherYesterday,
  fetchWeatherToday,
  fetchWeatherTomorrow,
  fetchWeatherMonth,
  fetchWeatherElements,
  fetchLocation,
} from 'store/operation';
import { setCityName } from 'store/actions';

import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

import { ChartWeather } from './ChartWeather';
import { Tiles } from './Tiles';
import { AirQuality } from './AirQuality';
import { WeatherMonth } from './WeatherMonth';
import { WeatherCurrentDay } from './WeatherCurrentDay';
import { WeatherMonthMobile } from './WeatherMonthMobile';
import { WeatherSunMoonMobile } from './WeatherSunMoonMobile';

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export const Weather = () => {
  const dispatch = useDispatch();
  const data_today = useSelector(getWeatherToday_Data);
  const CITY = useSelector(getCityName);

  const urlImage = 'https://www.visualcrossing.com/img/';

  const [valueCity, setValueCity] = useState('');
  const [country, setCountry] = useState('--');
  const [city, setCity] = useState('--');
  const [temperature, setTemperature] = useState('--');

  const [icon, setIcon] = useState('--');

  const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

  const REACT_APP_WEATHER_API_KEY_1 = 'D6MDZY6JMNHMG6CBQANG3GNHD';
  const REACT_APP_WEATHER_API_KEY_2 = 'ALDXRSSMA67DYTJF696P4X2T8';
  const REACT_APP_WEATHER_API_KEY_3 = 'GP4GVCRSPM49PLYL6GG3XCCND';
  // const REACT_APP_WEATHER_API_KEY_4 = 'ZFDDCEUX8YARVXWEHNHDQP74C';

  useEffect(() => {
    const BASE_URL_YESTERDAY = `${BASE_URL}${CITY}/yesterday?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_1}&contentType=json&lang=ru&unitGroup=metric`;
    const BASE_URL_TODAY = `${BASE_URL}${CITY}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_3}&contentType=json&lang=ru&unitGroup=metric`;
    const BASE_URL_TOMORROW = `${BASE_URL}${CITY}/tomorrow?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_3}&contentType=json&lang=ru&unitGroup=metric`;
    const URL_WEATHER_ELEMENTS = `${BASE_URL}${CITY}?key=${REACT_APP_WEATHER_API_KEY_2}&lang=ru&unitGroup=metric&include=days&elements=datetime,moonphase,sunrise,sunset,moonrise,moonset`;

    dispatch(fetchWeatherYesterday(BASE_URL_YESTERDAY));
    dispatch(fetchWeatherToday(BASE_URL_TODAY));
    dispatch(fetchWeatherTomorrow(BASE_URL_TOMORROW));
    dispatch(fetchWeatherElements(URL_WEATHER_ELEMENTS));
  }, [CITY, dispatch]);

  useEffect(() => {
    let API_KEY_WEATHER_30 = 'D6MDZY6JMNHMG6CBQANG3GNHD';

    const REACT_APP_WEATHER_API_KEY_1 = 'D6MDZY6JMNHMG6CBQANG3GNHD';
    const REACT_APP_WEATHER_API_KEY_2 = 'ALDXRSSMA67DYTJF696P4X2T8';
    const REACT_APP_WEATHER_API_KEY_3 = 'GP4GVCRSPM49PLYL6GG3XCCND';
    const REACT_APP_WEATHER_API_KEY_4 = 'ZFDDCEUX8YARVXWEHNHDQP74C';
    const REACT_APP_WEATHER_API_KEY_5 = 'VYYWDJ2KMZJECA8DACHPRUVU3';
    const hour = moment().format('H');

    if (hour > 20) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_5;
    else if (hour > 16) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_3;
    else if (hour > 12) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_4;
    else if (hour > 10) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_2;
    else if (hour > 8) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_1;

    const numberDay = moment().isoWeekday();
    const dateStart = moment()
      .add(0 - numberDay, 'days')
      .format('YYYY-MM-DD');
    const dateEnd = moment()
      .add(28 - numberDay, 'days')
      .format('YYYY-MM-DD');
    const DATE = `${dateStart}/${dateEnd}`;

    const URL_WEATHER = `${BASE_URL}${CITY}/${DATE}?key=${API_KEY_WEATHER_30}&lang=ru&unitGroup=metric`;

    dispatch(fetchWeatherMonth(URL_WEATHER));
  }, [CITY, dispatch]);

  function handleSearch(e) {
    if (e.key === 'Escape') {
      setValueCity('');
    }
    if (e.key === 'Enter') {
      if (valueCity.length > 1) {
        dispatch(setCityName(valueCity));
      }
      setValueCity('');
    }
    if (e.buttons === 0) {
      if (valueCity.length > 1) {
        dispatch(setCityName(valueCity));
      }
      setValueCity('');
    }
  }

  function handleLocation() {
    dispatch(fetchLocation());
  }

  function handleCity(e) {
    setValueCity(e.target.value);
  }

  useEffect(() => {
    const hour = moment().format('H');

    setCountry(data_today.resolvedAddress.split(', ')[1]); //Страна
    setCity(data_today.address); //Город
    setTemperature(data_today.days[0].hours[hour].temp.toFixed(0)); //Текущая температура в градусах цельсия
    setIcon(`${urlImage}${data_today.days[0].hours[hour].icon}.svg`); //Иконка погодных условий
  }, [data_today.address, data_today.days, data_today.resolvedAddress]);

  return (
    <div className="weather">
      <div className="weather__search">
        <div className="search__input-group">
          <button className="input-group__btn-location" type="button" onClick={handleLocation}>
            <GpsFixedIcon className="input-group__img" />
          </button>
          <input
            placeholder="Поиск местоположения"
            type="text"
            autocomplete="on"
            value={valueCity}
            onInput={handleCity}
            onKeyDown={handleSearch}
          />
          <button type="button" onClick={handleSearch}>
            <SearchIcon className="input-group__img" />
          </button>
        </div>

        <div className="search__card-city">
          <div className="card-city">
            <p>
              {country}, {city}
            </p>
            <img className="card-city__image" src={icon} widh="17" alt="icon" />
            <p>{temperature}°</p>
          </div>
        </div>
      </div>

      <div className="weathet__block-day">
        <WeatherCurrentDay></WeatherCurrentDay>
        <AirQuality></AirQuality>
      </div>

      <Media
        queries={{
          small: '(max-width: 599px)',
          medium: '(min-width: 600px)',
          // medium: '(min-width: 600px) and (max-width: 1199px)',
          // large: '(min-width: 1200px)',
        }}
      >
        {matches => (
          <Fragment>
            {matches.small && (
              <>
                <WeatherMonthMobile></WeatherMonthMobile>
                <WeatherSunMoonMobile></WeatherSunMoonMobile>
              </>
            )}
            {matches.medium && (
              <>
                <ChartWeather></ChartWeather>
                <WeatherMonth></WeatherMonth>
                <Tiles></Tiles>
              </>
            )}
            {/* {matches.large && <div></div>} */}
          </Fragment>
        )}
      </Media>
    </div>
  );
};
