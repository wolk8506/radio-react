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

  const [maxwind_ms, setMmaxwind_ms] = useState(0);

  useEffect(() => {
    if (data.currentConditions !== undefined) {
      setMmaxwind_ms(
        (data.days[0].hours[moment().format('H')].windgust / 3.6).toFixed(1)
      ); // Порывы ветра м/с
    }
  }, [data]);

  // !!!!!! Стили

  const styleWindW = {
    animationDuration: `${11 - Number(maxwind_ms)}s`,
  };

  return (
    <div className="img_q1_q2">
      <div className="img_q1" style={styleWindW}>
        <img src={q1} alt="hh" width={100} />
      </div>
      <div className="img_q2">
        <img src={q2} alt="hh" width={100} />
      </div>
      <p className="img_text">
        <svg className="icon" width="24" height="24">
          <use href={`${iconSVG}#icon-wind`}></use>
        </svg>
        {maxwind_ms} м/с
      </p>
    </div>
  );
};
