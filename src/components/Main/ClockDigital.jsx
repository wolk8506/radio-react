import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getWeatherToday_Data } from 'store/selectors';
import { fetchWeatherToday } from 'store/operation';
import { fetchLocation } from 'store/operation';
import { getCityName } from 'store/selectors';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const ClockDigital = () => {
  const [hh, setHh] = useState('00');
  const [mm, setMm] = useState('00');
  const [ss, setSs] = useState('00');

  const day = moment().format('dddd, DD MMMM YYYY');

  const setClock = () => {
    let day = new Date();

    const clockNull = i => {
      if (String(i).length < 2) {
        return '0' + i;
      } else return i;
    };

    setHh(clockNull(day.getHours()));
    setMm(clockNull(day.getMinutes()));
    setSs(clockNull(day.getSeconds()));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClock();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const CITY = useSelector(getCityName);
  const data = useSelector(getWeatherToday_Data);
  const dispatch = useDispatch();

  const URL_WEATHER = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours%2Cdays&key=GP4GVCRSPM49PLYL6GG3XCCND&contentType=json&lang=ru&unitGroup=metric`;
  const urlImage = 'https://www.visualcrossing.com/img/';

  const [image, setImage] = useState(`${urlImage}clear-day.svg`);
  const [temperature, setTemperature] = useState(0);
  const [conditionText, setConditionText] = useState('--');
  const [description, setDescription] = useState('-');

  // Запрос погоды, если первый раз, то погоду определяет по IP, делеее берет локацию из store
  useEffect(() => {
    if (CITY === null) {
      dispatch(fetchLocation()); //Определение локации
    } else dispatch(fetchWeatherToday(URL_WEATHER)); //Запрос на погоду после определения локации и все последующие запросы
  }, [CITY, URL_WEATHER, dispatch]);

  useEffect(() => {
    const hour = moment().format('H');

    setTemperature(data.days[0].hours[hour].temp.toFixed(0)); //Текущая температура в градусах цельсия
    setImage(`${urlImage}${data.days[0].hours[hour].icon}.svg`); //Иконка погодных условий
    setConditionText(data.days[0].hours[hour].conditions); //Погодные условия, описание
    setDescription(data.description);
  }, [data]);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

  useEffect(() => {
    // Обновление погоды каждые 15 минут
    const interval = setInterval(() => {
      dispatch(fetchWeatherToday(URL_WEATHER));
    }, 1800000);

    return () => clearInterval(interval);
  }, [URL_WEATHER, dispatch]);

  return (
    <div className="clock-weather">
      <div className="clock-weather__block-clock">
        <div className="block-clock__clock">
          <div className="clock__number">{hh}</div>
          <div>:</div>
          <div className="clock__number">{mm}</div>

          <div className="clock__second">{ss}</div>
        </div>
        <p className="clock__text">{day}</p>
      </div>

      <div className="clock-weather__block-weather">
        <div className="block-weather__weather">
          <div className="weather__img">
            <img src={image} alt="hh" width={172} />
          </div>

          <div className="weather__value">{temperature}°</div>
        </div>
        <p>{conditionText}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};
