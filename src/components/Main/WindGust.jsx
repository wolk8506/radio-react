import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import sprite from '../../images/sprite.svg';

import q1 from './img/untitled14.svg';
import q2 from './img/untitled20.svg';

export const WindGust = () => {
  const data = useSelector(state => state.storeWeather15);
  const iconSVG = sprite;

  const [maxwind_ms, setMaxwind_ms] = useState(19.9);
  const [rotationSpeed, setRotationSpeed] = useState(0);

  useEffect(() => {
    setMaxwind_ms(
      Number(
        (data.days[0].hours[moment().format('H')].windgust / 3.6).toFixed(1)
      )
    ); // Порывы ветра м/с
  }, [data]);

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
        <img src={q1} alt="hh" width={100} />
      </div>
      <div className="frame">
        <img src={q2} alt="hh" width={100} />
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
