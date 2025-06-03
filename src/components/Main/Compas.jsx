import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import sprite from '../../images/sprite.svg';

export const Compas = () => {
  const data_today = useSelector(weatherSelectors.getWeatherToday_Data);

  const iconSVG = sprite;

  const [wind_degree, setWind_degree] = useState(0);
  const [wind_ms, setWind_ms] = useState('--');

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    if (!data_today) return;
    setWind_degree(data_today.days[0].winddir);
    setWind_ms((data_today.days[0].windspeed / 3.6).toFixed(1));
  }, [data_today]);

  // !!!!!! Стили

  const styleWindW = {
    transform: `rotate(${wind_degree + 270}deg)`,
  };

  return (
    <div id="clock">
      <ul id="marks">
        <li className="char">
          <p>С</p>
        </li>
        <li></li>
        <li></li>
        <li className="large"></li>
        <li></li>
        <li></li>
        <li className="char">
          <p>В</p>
        </li>
        <li></li>
        <li></li>
        <li className="large"></li>
        <li></li>
        <li></li>
        <li className="char">
          <p>Ю</p>
        </li>
        <li></li>
        <li></li>
        <li className="large"></li>
        <li></li>
        <li></li>
        <li className="char">
          <p>З</p>
        </li>
        <li></li>
        <li></li>

        <li className="large"></li>
        <li></li>
        <li></li>
      </ul>
      <div className="arrow_block" style={styleWindW}>
        <svg className="icon">
          <use href={`${iconSVG}#icon-arrow`}></use>
        </svg>
      </div>
      <div className="arrow_text">
        <p>{wind_ms}</p>
        <p>м/с</p>
      </div>
    </div>
  );
};
