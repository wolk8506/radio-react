import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import sprite from '../../images/sprite.svg';

import moment from 'moment';

export const WindGust = () => {
  const data_today = useSelector(weatherSelectors.getWeatherToday_Data);
  const iconSVG = sprite;

  const [maxwind_ms, setMaxwind_ms] = useState(19.9);
  const [rotationSpeed, setRotationSpeed] = useState(0);

  useEffect(() => {
    setMaxwind_ms(Number((data_today.days[0].hours[moment().format('H')].windgust / 3.6).toFixed(1))); // Порывы ветра м/с
  }, [data_today]);

  // !!!!!! Стили

  useEffect(() => {
    if (maxwind_ms > 30) {
      setRotationSpeed((40 - maxwind_ms) * 0.02 + 0.2);
    } else if (maxwind_ms > 20) {
      setRotationSpeed((30 - maxwind_ms) * 0.04 + 0.4);
    } else if (maxwind_ms > 10) {
      setRotationSpeed((20 - maxwind_ms) * 0.02 + 0.8);
    } else {
      setRotationSpeed(11 - maxwind_ms);
    }
  }, [maxwind_ms]);

  const styleWindW = {
    animationDuration: `${rotationSpeed}s`,
  };

  return (
    <div className="wind-block">
      <div className="blades" style={styleWindW}>
        <svg className="icon" width="80" height="80">
          <use href={`${iconSVG}#icon-blades`}></use>
        </svg>
      </div>
      <div className="frame">
        <svg className="icon-frame" width="80" height="80">
          <use href={`${iconSVG}#icon-frame`}></use>
        </svg>
      </div>
      <p className="img-text">
        <svg className="icon" width="24" height="24">
          <use href={`${iconSVG}#icon-wind`}></use>
        </svg>
        {maxwind_ms} м/с
      </p>
    </div>
  );
};
