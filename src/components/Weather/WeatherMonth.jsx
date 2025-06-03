import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import sprite from '../../images/sprite.svg';
import weatherImage from 'components/Weather/weatherIcon';

import { weatherSelectors, rootSelectors } from 'store';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const WeatherMonth = () => {
  const themeImageWeather = useSelector(rootSelectors.getThemeIconWeather);
  const data_month = useSelector(weatherSelectors.getWeatherMonth_Data);
  const timeUpdate = useSelector(weatherSelectors.getWeatherMonth_TimeUpdate);
  const iconSVG = sprite;
  const [dataDays, setDataDays] = useState([]);
  const [datetime, setDatetime] = useState('--:--');

  useEffect(() => {
    const data = [];
    const numberDay = moment().isoWeekday();
    setDatetime(timeUpdate);

    data_month.days.forEach((el, i) => {
      if (i > 0) {
        data.push({ ...el, dayEnable: i >= numberDay, key: el.datetime });
      }
    });

    setDataDays(data);
  }, [data_month, timeUpdate]);

  return (
    <>
      <div className="weather-month__title">
        <span>Погода на месяц</span>
        <span className="title__time-update">{datetime}</span>
      </div>
      <div className="weather__month">
        <ul className="month__day-name">
          <li className="day-name__item">Пн</li>
          <li className="day-name__item">Вт</li>
          <li className="day-name__item">Ср</li>
          <li className="day-name__item">Чт</li>
          <li className="day-name__item">Пт</li>
          <li className="day-name__item">Сб</li>
          <li className="day-name__item">Вс</li>
        </ul>
        <ul className="month__block-day">
          {dataDays.map(i => {
            return (
              <li key={i.key} className="block-day__card">
                <div
                  className={`card__block ${i.dayEnable ? '' : 'card__block--on'}
                    ${i.datetime === moment().format('YYYY-MM-DD') ? 'card__block--current' : ''}
                  `}
                >
                  <p className="block__title">{moment(i.datetime).format('DD MMMM')}</p>
                  <div className="block__description">
                    <img src={weatherImage(i.icon, themeImageWeather)} alt={i.icon} width={48} />
                    <div className="description__text">
                      <p>{i.tempmax}°</p>
                      <p>{i.tempmin}°</p>
                    </div>
                  </div>
                </div>
                <div className="card__detail">
                  <div className="detail__item">
                    <svg width="24" height="24">
                      <use href={`${iconSVG}#icon-barometer`}></use>
                    </svg>
                    <p>{(i.pressure * 0.75).toFixed(0)} мм</p>
                  </div>
                  <div className="detail__item">
                    <svg width="24" height="24">
                      <use href={`${iconSVG}#icon-clouds`}></use>
                    </svg>
                    <p>{i.humidity}%</p>
                  </div>
                  <div className="detail__item">
                    <svg width="24" height="24">
                      <use href={`${iconSVG}#icon-sun`}></use>
                    </svg>
                    <p>{i.uvindex} UV</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
