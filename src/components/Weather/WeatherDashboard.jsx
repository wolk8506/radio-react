import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import sprite from '../../images/sprite.svg';
import s from './WeatherDashboard.module.css';

export const WeatherDashboard = () => {
  const data = useSelector(state => state.storeWeather);
  // const data15 = useSelector(state => state.storeWeather15);

  const iconSVG = sprite;

  // const [country, setCountry] = useState('--');
  // const [city, setCity] = useState('--');
  // const [timeZone, setTimeZone] = useState('--');
  const [temperature, setTemperature] = useState('--');
  const [conditionText, setConditionText] = useState('--');
  const [wind_ms, setWind_ms] = useState('--');
  const [wind_degree, setWind_degree] = useState(0);
  const [sunrise, setSunrise] = useState('--');
  const [sunsetH, setSunsetH] = useState('--');
  const [sunsetM, setSunsetM] = useState('--');
  const [pressure_mb, setPressure_mb] = useState('--');
  const [cloud, setCloud] = useState('--');
  // const [vis_km, setVis_km] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const [maxwind_ms, setMmaxwind_ms] = useState('--');
  // const [uv, setUv] = useState('--');
  const [precip_mm, setPrecip_mm] = useState('--');
  // const [moonrise, setMoonrise] = useState('--:--');
  // const [moonset, setMoonset] = useState('--:--');
  const [icon, setIcon] = useState('--');
  // const [last_updated, setLast_updated] = useState('--');

  const date = new Date();
  const dayAndMonth = date.toLocaleDateString('ru-RU', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    if (data.location !== undefined) {
      // setCountry(data.location.country); //Страна
      // setCity(data.location.name); //Город
      // setTimeZone(data.location.tz_id); //Временная зона
      setTemperature(data.current.feelslike_c); //Текущая температура в градусах цельсия
      setConditionText(data.current.condition.text); //Погодные условия, описание
      setWind_ms((data.current.wind_kph / 3.6).toFixed(2)); //Скорость ветра в м/с
      setWind_degree(data.current.wind_degree); //Направление ветра в градусах   data.current.wind_degree + 136,
      setSunrise(data.forecast.forecastday[0].astro.sunrise.slice(0, -3)); //Время рассвета
      setSunsetH(
        Number(data.forecast.forecastday[0].astro.sunset.slice(0, 2)) + 12
      ); //Время заката - часы
      setSunsetM(data.forecast.forecastday[0].astro.sunset.slice(3, -3)); //Время заката - минуты
      setIcon(
        `//cdn.weatherapi.com/weather/128x128${data.current.condition.icon.slice(
          34
        )}`
      ); //Иконка погодных условий
      setPressure_mb(data.current.pressure_mb); //Давление мм рт сб
      setCloud(data.current.cloud); // Облачность
      // setVis_km(data.current.vis_km); // Видимость километров
      setHumidity(data.current.humidity); // Влажность
      setMmaxwind_ms(
        (data.forecast.forecastday[0].day.maxwind_kph / 3.6).toFixed(2)
      ); // Порывы ветра м/с
      // setUv(data.current.uv); // Ультрофиолет
      setPrecip_mm(data.current.precip_mm); // Осадки мм
      // const moonrise = data.forecast.forecastday[0].astro.moonrise;
      // const moonset = data.forecast.forecastday[0].astro.moonset;
      // setLast_updated(data.current.last_updated);

      // if (moonrise.slice(6) === 'PM') {
      //   setMoonrise(
      //     `${Number(moonrise.slice(0, 2)) + 12}:${moonrise.slice(3, 5)}`
      //   );
      // } else setMoonrise(moonrise.slice(0, 5));

      // if (moonset.slice(6) === 'PM') {
      //   setMoonset(
      //     `${Number(moonset.slice(0, 2)) + 12}:${moonset.slice(3, 5)}`
      //   );
      // } else setMoonset(moonset.slice(0, 5));
    }
  }, [data]);

  // !!!!!! Стили

  const styleWindW = {
    transform: `rotate(${wind_degree}deg)`,
  };

  return (
    <div>
      <div className={s.blockDay}>
        <div className={s.blockDayLeft}>
          <p>{dayAndMonth}</p>
          <div>
            <img src={icon} widh="128" alt="icon" />
            <p>{temperature}°</p>
          </div>
          <p className={s.conditionText}>{conditionText}</p>
        </div>

        <div className={s.blockDayRight}>
          <div className={s.conditionBlockSmall}>
            <p title="Количество осадков" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-umbrella`}></use>
              </svg>
              {precip_mm} мм
            </p>

            <p title="Облачность" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-clouds`}></use>
              </svg>
              {cloud} %
            </p>

            <p title="Влажность" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-raindrop1`}></use>
              </svg>
              {humidity} %
            </p>
            <p title="Восход солнца" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sunrise`}></use>
              </svg>
              {sunrise}
            </p>
          </div>

          <div>
            <p
              title="Скорость и направление ветра"
              className={s.conditionBlockItem}
            >
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-air-sock`}></use>
              </svg>
              {wind_ms} м/с &#160;
              <svg width="32" height="32" style={styleWindW}>
                <use href={`${iconSVG}#icon-wind-w`}></use>
              </svg>
            </p>

            <p title="Порывы ветра" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-wind`}></use>
              </svg>
              {maxwind_ms} м/с
            </p>

            <p title="Давление" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-barometer`}></use>
              </svg>
              {pressure_mb} мм
            </p>

            <p title="Закат солнца" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sunset`}></use>
              </svg>
              {sunsetH}:{sunsetM}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
