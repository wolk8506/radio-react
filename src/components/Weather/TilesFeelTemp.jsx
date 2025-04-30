import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getWeatherYesterday_Data, getWeatherToday_Data, getWeatherTomorrow_Data } from 'store/root/selectors';

import moment from 'moment';

export const TilesFeelTemp = () => {
  const data_yesterday = useSelector(getWeatherYesterday_Data);
  const data_today = useSelector(getWeatherToday_Data);
  const data_tomorrow = useSelector(getWeatherTomorrow_Data);

  const [dataChart, setDataChart] = useState([0, 0, 0, 1]);
  const [feelslike, setFeelslike] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [wind_ms, setWind_ms] = useState(0);
  const [feelingTitle, setFeelingTitle] = useState('--');
  const [dominantFactor, setDominantFactor] = useState('отсутствует');
  const [dominantFactorDescription, setDominantFactorDescription] = useState('---');

  useEffect(() => {
    const hour = Number(moment().format('H'));
    setTemperature(Number(data_today.days[0].hours[hour].temp.toFixed(0))); //Текущая температура в градусах цельсия
    setFeelslike(Number(data_today.days[0].hours[hour].feelslike.toFixed(0)));
    setWind_ms(Number((data_today.days[0].hours[hour].windspeed / 3.6).toFixed(0))); //Скорость ветра в м/с
  }, [data_today]);

  useEffect(() => {
    if (feelslike === temperature) {
      setDominantFactor('отсутствует');
      setDominantFactorDescription('');
    }
    if (feelslike < temperature) {
      if (wind_ms <= 2) {
        setDominantFactor('отсутствует');
        setDominantFactorDescription('Ощущается холоднее, чем фактическая температура.');
      }
      if (wind_ms > 2) {
        setDominantFactor('ветер');
        setDominantFactorDescription('Из-за ветра ощущается холоднее, чем фактическая температура.');
      }
    }
  }, [feelslike, temperature, wind_ms]);

  useEffect(() => {
    if (feelslike > 35) setFeelingTitle('Крайне жарко.');
    else if (feelslike > 30) setFeelingTitle('Очень жарко.');
    else if (feelslike > 24) setFeelingTitle('Жарко (комфортно при пляжном отдыхе)');
    else if (feelslike > 18) setFeelingTitle('Тепло (комфортно).');
    else if (feelslike > 12) setFeelingTitle('Умеренно тепло.');
    else if (feelslike > 6) setFeelingTitle('Прохладно.');
    else if (feelslike > 0) setFeelingTitle('Умеренно прохладно.');
    else if (feelslike > -12) setFeelingTitle('Умеренно холодно.');
    else if (feelslike > -24) setFeelingTitle('Холодно.');
    else if (feelslike > 30) setFeelingTitle('Очень холодно.');
    else if (feelslike < 30) setFeelingTitle('Крайне холодно.');
  }, [feelslike]);

  useEffect(() => {
    const hour = Number(moment().format('H'));

    const arr_1 = [];
    const arr_2 = [];
    const arr_3 = [];

    const numberOfHoursInAday = data_yesterday.days[0].hours.length;
    arr_1.push(data_yesterday.days[0].hours[numberOfHoursInAday - 3].pressure);
    arr_1.push(data_yesterday.days[0].hours[numberOfHoursInAday - 2].pressure);

    // arr_2  day+0
    arr_1.push(...data_today.days[0].hours.map(i => i.feelslike));

    // arr_3  day+1
    arr_1.push(...data_tomorrow.days[0].hours.map(i => i.feelslike));

    // выборка 4 часа
    const t1 = arr_1[hour + 0];
    const t2 = arr_1[hour + 1];
    const t3 = arr_1[hour + 2];
    let t4 = arr_1[hour + 3];

    //  поиск следующего изменения
    let n = 1;
    while (t3 === t4) {
      n++;
      t4 = arr_1[hour + 2 + n];
    }

    arr_2.push(t1, t2, t3, t4);

    const t_min = Math.min(...arr_2.map(i => i));
    const t_max = Math.max(...arr_2.map(i => i));
    const step = 30 / (t_max - t_min);
    arr_3.push(...arr_2.map(i => (t_max - i) * step + 20));

    setDataChart(arr_3);
  }, [data_today.days, data_tomorrow.days, data_yesterday.days]);

  let valueArr = [
    {
      x: 4,
      y: dataChart[0],
    },
    {
      x: 90,
      y: dataChart[1],
    },
    {
      x: 180,
      y: dataChart[2],
    },
    {
      x: 256,
      y: dataChart[3],
    },
  ];

  let steps = [];

  valueArr.forEach((curr, index) => {
    if (index === 0) steps.push('M' + curr.x + ',' + curr.y);

    if (index !== valueArr.length - 1) {
      let next = valueArr[index + 1];
      var ctrl1 = {
        x: (curr.x + next.x) * 0.5,
        y: curr.y,
      };
      var ctrl2 = {
        x: ctrl1.x,
        y: next.y,
      };
      steps.push('C' + ctrl1.x + ',' + ctrl1.y);
      steps.push(ctrl2.x + ',' + ctrl2.y);
      steps.push(next.x + ',' + next.y);
    }
  });

  return (
    <div className="card__item">
      <p className="item__title">Ощущается как</p>
      <div className="feel-temp">
        <svg width="260" height="77" viewBox="0 0 260 77" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="FeelslikeCardGradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0" stopColor="#96C6FA"></stop>
              <stop offset="74%" stopColor="#96C6FA"></stop>
              <stop offset="74%" className="feel-temp__svg-line"></stop>
            </linearGradient>
          </defs>
          <defs>
            <g id="feelslikeTrendPath">
              <path
                d={steps}
                stroke="url('#FeelslikeCardGradient')"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <circle
                stroke="#fff"
                strokeWidth="3"
                fill="#96C6FA"
                cx={valueArr[2].x}
                cy={valueArr[2].y}
                r="10"
              ></circle>
            </g>
          </defs>
          <use
            x="0"
            y="0"
            width="260"
            height="77"
            href="#feelslikeTrendPath"
            style={{ boxShadow: 'rgb(255, 255, 255) 0px 2px 0px inset' }}
          ></use>
        </svg>
        <div className="feel-temp__block-temp">
          <p className="block-temp__title">Доминантный фактор: {dominantFactor}</p>

          <div className="block-temp__value-content">
            <div className="value-content">
              <span className="value-content__label" title="Ощущается как">
                Ощущается как:
              </span>

              <span className="value-content__value" title="Температура">
                {feelslike}°
              </span>
            </div>
            <div className="value-content">
              <span className="value-content__label" title="Температура">
                Температура:
              </span>
              <span className="value-content__value" title="Температура">
                {temperature}°
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="item__text">{feelingTitle}</p>
      <p className="item__sub-text">{dominantFactorDescription}</p>
    </div>
  );
};
