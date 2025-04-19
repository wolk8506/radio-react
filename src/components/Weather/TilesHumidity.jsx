import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getWeatherToday_Data } from 'store/root/selectors';

import moment from 'moment';

export const TilesHumidity = () => {
  const data_today = useSelector(getWeatherToday_Data);

  const [humidityTitle, setHumidityTitle] = useState('Нормальный воздух');
  const [humidityPercentage, setHumidityPercentage] = useState(0);
  const [dew, setDew] = useState(0);

  useEffect(() => {
    const hour = moment().format('H');
    setHumidityPercentage(Number(data_today.days[0].hours[hour].humidity.toFixed(0))); // Влажность
    setDew(data_today.days[0].hours[hour].dew);
  }, [data_today]);

  const humidityValue = {
    height: humidityPercentage,
  };

  useEffect(() => {
    if (humidityPercentage < 40) {
      setHumidityTitle('Сухой воздух');
    } else if (humidityPercentage <= 50) {
      setHumidityTitle('Нормальный воздух');
    } else if (humidityPercentage <= 60) {
      setHumidityTitle('Влажный воздух');
    } else if (humidityPercentage > 60) {
      setHumidityTitle('Мокрый воздух');
    }
  }, [humidityPercentage]);

  return (
    <div className="card__item">
      <p className="item__title">Влажность</p>
      <div className="humidity">
        <div className="hunidity__image">
          <div className="image__box">
            <div className="box__percentage" style={humidityValue}></div>
          </div>
          <div className="image__box">
            <div className="box__percentage" style={humidityValue}></div>
          </div>
          <div className="image__box">
            <div className="box__percentage" style={humidityValue}></div>
          </div>
          <div className="image__box">
            <div className="box__percentage" style={humidityValue}></div>
          </div>
          <div className="image__box">
            <div className="box__percentage" style={humidityValue}></div>
          </div>
          <div className="image__box">
            <div className="box__percentage" style={humidityValue}></div>
          </div>
          <div className="image__box">
            <div className="box__percentage" style={humidityValue}></div>
          </div>
        </div>
        <div className="humidity__info">
          <p className="info__humidity-value">{humidityPercentage}%</p>
          <p className="info__humidity-text">Относительная влажность</p>
          <p className="info__humidity-value">{dew}°</p>
          <p className="info__humidity-text">Точка росы</p>
        </div>
      </div>
      <p className="item__text">{humidityTitle}</p>
    </div>
  );
};
