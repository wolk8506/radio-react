import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import sprite from '../../images/sprite.svg';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const WeatherCurrentDay = () => {
  const data_today = useSelector(state => state.storeWeatherLastDay.today);
  const data_month = useSelector(state => state.storeWeather15);

  const urlImage = 'https://www.visualcrossing.com/img/';
  const iconSVG = sprite;

  const [temperature, setTemperature] = useState('--');
  const [wind_ms, setWind_ms] = useState('--');
  const [wind_degree, setWind_degree] = useState(0);
  const [pressure_mb, setPressure_mb] = useState('--');
  const [vis_km, setVis_km] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const [uv, setUv] = useState('--');
  const [icon, setIcon] = useState('--');
  const [dew, setDew] = useState(0);
  const [feelslike, setFeelslike] = useState('0');
  const [tempmax, setTempmax] = useState('-');
  const [datetime, setDatetime] = useState('--:--');
  const [conditionText, setConditionText] = useState('--');
  const [description, setDescription] = useState('-');

  useEffect(() => {
    const hour = moment().format('H');

    setTemperature(data_today.days[0].hours[hour].temp.toFixed(0)); //Текущая температура в градусах цельсия
    setIcon(`${urlImage}${data_today.days[0].hours[hour].icon}.svg`); //Иконка погодных условий
    setUv(data_today.days[0].hours[hour].uvindex); // Ультрофиолет
    setPressure_mb((data_today.days[0].hours[hour].pressure * 0.75).toFixed(0)); //Давление мм рт сб
    setVis_km(data_today.days[0].hours[hour].visibility); // Видимость километров
    setHumidity(data_today.days[0].hours[hour].humidity); // Влажность
    setWind_degree(data_today.days[0].hours[hour].winddir); //Направление ветра в градусах   data.current.wind_degree + 136,
    setWind_ms((data_today.days[0].hours[hour].windspeed / 3.6).toFixed(2)); //Скорость ветра в м/с
    setDew(data_today.days[0].hours[hour].dew);
    setFeelslike(data_today.days[0].hours[hour].feelslike);
    setTempmax(data_today.days[0].tempmax);
    setDatetime(data_month.currentConditions.datetime);

    setConditionText(data_today.days[0].hours[hour].conditions); //Погодные условия, описание
    setDescription(data_today.description);
  }, [data_month, data_today]);

  // !!!!!! Стили

  const styleWindW = {
    transform: `rotate(${wind_degree}deg)`,
  };

  return (
    <div className="weather__current-day">
      <div className="current-day__label">
        <p className="label__title">Текущая погода</p>
        <p className="label__time">{datetime}</p>
      </div>
      <div className="current-day__summary">
        <div className="summary__overview">
          <img className="overview__image" src={icon} widh="78" alt="icon" />
          <p className="overview__temperatura">
            {temperature}
            <span>°C</span>
          </p>
          <div className="overview__feedback">
            <p className="feedback__condition">{conditionText}</p>
            <p className="feedback__temperature">Ощущается как {feelslike} °C</p>
          </div>
        </div>
        <p className="summary__description">
          {description}. Макс. температура — {tempmax}°.
        </p>
      </div>
      <div className="weather__detail-line">
        <div>
          <p className="detail-line__title">Ультрофиолет</p>
          <p className="detail-line__value">{uv}</p>
        </div>
        <div>
          <p className="detail-line__title">Ветер</p>
          <p className="detail-line__value detail-line__value--wind">
            {wind_ms} м/с &#160;
            <svg width="20" height="20" style={styleWindW}>
              <use href={`${iconSVG}#icon-wind-w`}></use>
            </svg>
          </p>
        </div>
        <div>
          <p className="detail-line__title">Влажность</p>
          <p className="detail-line__value">{humidity}%</p>
        </div>
        <div>
          <p className="detail-line__title">Видимость</p>
          <p className="detail-line__value">{vis_km}км</p>
        </div>
        <div>
          <p className="detail-line__title">Давление</p>
          <p className="detail-line__value">{pressure_mb} мм</p>
        </div>
        <div>
          <p className="detail-line__title">Точка росы</p>
          <p className="detail-line__value">{dew}°</p>
        </div>
      </div>
    </div>
  );
};
