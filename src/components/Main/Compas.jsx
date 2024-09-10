import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import arrow from './img/arrow.svg';

export const Compas = () => {
  const data = useSelector(state => state.storeWeather15);

  // const iconSVG = sprite;

  const [wind_degree, setWind_degree] = useState(0);
  const [wind_ms, setWind_ms] = useState('--');

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // console.log('data: ', data);
  useEffect(() => {
    if (data.currentConditions !== undefined) {
      setWind_degree(data.currentConditions.winddir);
      setWind_ms((data.currentConditions.windspeed / 3.6).toFixed(1));
    }
  }, [data]);

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
        <img src={arrow} alt="arrow" id="arrow-pointer" />
      </div>
      <div className="arrow_text">
        <p>{wind_ms}</p>
        <p>м/с</p>
      </div>
    </div>
  );
};
