import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { weatherSelectors, weatherOperations, rootSelectors } from 'store';

import weatherImage from 'components/Weather/weatherIcon';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const ClockDigital = () => {
  const themeImageWeather = useSelector(rootSelectors.getThemeIconWeather);
  const clock_AnalogDigital = useSelector(rootSelectors.getThemeClock_AnalogDigital);
  const [hh, setHh] = useState('00');
  const [mm, setMm] = useState('00');
  const [ss, setSs] = useState('00');
  const [hourDeg, setHourDeg] = useState(0);
  const [minuteDeg, setMinuteDeg] = useState(0);
  const [secondDeg, setSecondDeg] = useState(0);

  const day_1 = moment().format('dddd');
  const day_2 = moment().format('DD MMMM YYYY');
  const dayAnalogClock = moment().format('dd, DD MMMM YYYY');

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

    // * analog clock
    const hour = day.getHours();
    const minute = day.getMinutes();
    const second = day.getSeconds();
    setHourDeg(hour * 30 + minute * 0.5);
    setMinuteDeg(minute * 6 + minute * 0.1);
    setSecondDeg(second * 6);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClock();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const CITY = useSelector(weatherSelectors.getCityName);
  const data = useSelector(weatherSelectors.getWeatherToday_Data);
  const dispatch = useDispatch();

  const URL_WEATHER = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours%2Cdays&key=GP4GVCRSPM49PLYL6GG3XCCND&contentType=json&lang=ru&unitGroup=metric`;

  const [image, setImage] = useState(weatherImage('clear-day', themeImageWeather));
  const [temperature, setTemperature] = useState(0);
  const [conditionText, setConditionText] = useState('--');
  const [description, setDescription] = useState('-');

  // Запрос погоды, если первый раз, то погоду определяет по IP, делеее берет локацию из store
  useEffect(() => {
    if (CITY === null) {
      dispatch(weatherOperations.fetchLocation()); //Определение локации
    } else dispatch(weatherOperations.fetchWeatherToday(URL_WEATHER)); //Запрос на погоду после определения локации и все последующие запросы
  }, [CITY, URL_WEATHER, dispatch]);

  useEffect(() => {
    const hour = moment().format('H');

    setTemperature(data.days[0].hours[hour].temp.toFixed(0)); //Текущая температура в градусах цельсия
    setImage(weatherImage(data.days[0].hours[hour].icon, themeImageWeather)); //Иконка погодных условий
    setConditionText(data.days[0].hours[hour].conditions); //Погодные условия, описание
    setDescription(data.description);
  }, [data, themeImageWeather]);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

  useEffect(() => {
    // Обновление погоды каждые 15 минут
    const interval = setInterval(() => {
      dispatch(weatherOperations.fetchWeatherToday(URL_WEATHER));
    }, 1800000);

    return () => clearInterval(interval);
  }, [URL_WEATHER, dispatch]);

  return (
    <div className="clock-weather">
      {clock_AnalogDigital && (
        <div className="clock-weather__block-clock">
          <div className="block-clock__clock">
            <div className="clock__number">{hh}</div>
            <div>:</div>
            <div className="clock__number">{mm}</div>
            <div className="clock__second">{ss}</div>
          </div>
          <p className="clock__text">
            {day_1} <br />
            {day_2}
          </p>
          {/* <p className="clock__text"></p> */}
        </div>
      )}
      {/* -------------------------------------- */}
      {!clock_AnalogDigital && (
        <div className="block__clock-analog">
          <section className="clock-analog">
            <div className="clockcontainer" data-analogclock>
              <div className="minute hand" data-minute style={{ transform: `rotateZ(${minuteDeg}deg)` }}>
                <div className="minute-p1"></div>
                <div className="minute-p2"></div>
                <div className="minute-p3"></div>
              </div>
              <div className="hour hand" data-hour style={{ transform: `rotateZ(${hourDeg}deg)` }}>
                <div className="hour-p1"></div>
                <div className="hour-p2"></div>
                <div className="hour-p3"></div>
              </div>
              <div className="second hand" data-second style={{ transform: `rotateZ(${secondDeg}deg)` }}>
                <div className="second-p1"></div>
              </div>

              <div className="number number1">.</div>
              <div className="number number2">.</div>
              <div className="number number3">.</div>
              <div className="number number4">.</div>
              <div className="number number5">.</div>
              <div className="number number6">.</div>
              <div className="number number7">.</div>
              <div className="number number8">.</div>
              <div className="number number9">.</div>
              <div className="number number10">.</div>
              <div className="number number11">.</div>
              <div className="number number12">.</div>
            </div>
          </section>
          <p className="clock-analog-text">{dayAnalogClock}</p>
        </div>
      )}

      {/* ------------------------------------- */}
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
