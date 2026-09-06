import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const TilesUv = () => {
  // const data_today = useSelector(weatherSelectors.getWeatherToday_Data);

  const data_today = useSelector(weatherSelectors.getWeatherWeek_Data);

  const [uv, setUv] = useState('--');
  useEffect(() => {
    const hour = moment().format('H');

    setUv(data_today.days[1].hours[hour].uvindex); // Ультрофиолет
  }, [data_today]);

  const [axisX, setAxisX] = useState('52');
  const [axisY, setAxisY] = useState('144');
  useEffect(() => {
    let x, y, corner;
    var pi = Math.PI;
    const alfa = 240 - 30.5 * Number(uv); //  от -65 до 240  // Угол поворота
    const Radius = 75; //Radius - радиус
    const centrX = 90; //centrX - координата центра по оси х
    const centrY = 80; //centrY - координата центра по оси у

    corner = 2 * pi - (alfa / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    x = parseInt(Radius * Math.cos(corner) + centrX); // считаем новые координаты точки по оси х
    y = parseInt(Radius * Math.sin(corner) + centrY); // считаем новые координаты по оси у
    setAxisX(x);
    setAxisY(y);
  }, [uv]);

  const [uvTitle, setUvTitle] = useState('');
  const [uvSubTitle, setSubUvTitle] = useState('');
  useEffect(() => {
    if (uv < 3) {
      setUvTitle('Низкий');
      setSubUvTitle('Нет опасности для обычного человека');
    } else if (uv < 6) {
      setUvTitle('Умеренный');
      setSubUvTitle('Небольшой риск вреда от незащищенного пребывания на солнце');
    } else if (uv < 8) {
      setUvTitle('Высокая');
      setSubUvTitle('Высокий риск вреда от незащищенного пребывания на солнце');
    } else {
      setUvTitle('Очень высоко');
      setSubUvTitle('Очень высокий риск вреда от незащищенного пребывания на солнце');
    }
  }, [uv]);

  return (
    <div className="card__item">
      <p className="item__title">УФ</p>
      <div className="uv">
        <svg width="130" height="134" viewBox="5 -12 171 182" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 90.5 80 m 76 0 a 76 76 0 0 1 -32 62.3 "
            transform="rotate(13 90.5 80)"
            fill="none"
            stroke="#5C2E91"
            strokeWidth="8"
            strokeLinecap="round"
          ></path>
          <path
            d="M 90.5 80 m 76 0 a 76 76 0 0 1 -32 62.3 "
            transform="rotate(-52 90.5 80)"
            fill="none"
            stroke="#D13438"
            strokeWidth="8"
            strokeLinecap="round"
          ></path>
          <path
            d="M 90.5 80 m 76 0 a 76 76 0 0 1 -32 62.3 "
            transform="rotate(-115 90.5 80)"
            fill="none"
            stroke="#FF8C00"
            strokeWidth="8"
            strokeLinecap="round"
          ></path>
          <path
            d="M 90.5 80 m 76 0 a 76 76 0 0 1 -32 62.3 "
            transform="rotate(-178 90.5 80)"
            fill="none"
            stroke="#FDE300"
            strokeWidth="8"
            strokeLinecap="round"
          ></path>
          <path
            d="M 90.5 80 m 76 0 a 76 76 0 0 1 -32 62.3 "
            transform="rotate(-243 90.5 80)"
            fill="none"
            stroke="#73AA24"
            strokeWidth="8"
            strokeLinecap="round"
          ></path>
          {axisX && (
            <g>
              <circle cx={axisX} cy={axisY} r="10" fill="#FDE300"></circle>
              <circle cx={axisX} cy={axisY} r="11.5" stroke="white" strokeWidth="3"></circle>
            </g>
          )}
        </svg>
        <p className="uv__uv-value">{uv}</p>
      </div>
      <p className="item__text">{uvTitle}</p>
      <p className="item__sub-text">{uvSubTitle}</p>
    </div>
  );
};
