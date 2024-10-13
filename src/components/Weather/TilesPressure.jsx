import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

export const TilesPressure = () => {
  const data_yesterday = useSelector(
    state => state.storeWeatherLastDay.yesterday.days[0]
  );
  const data_today = useSelector(
    state => state.storeWeatherLastDay.today.days[0]
  );
  const data_tomorrow = useSelector(
    state => state.storeWeatherLastDay.tomorrow.days[0]
  );

  const [pressure_mb, setPressure_mb] = useState('--');
  const [dataChart, setDataChart] = useState([0, 0, 0, 1]);
  const [statusText, setStatusText] = useState('--');
  const [statusDescriptionText, setStatusDescriptionText] = useState('--');

  const datetime = moment().format('HH:mm');

  useEffect(() => {
    const hour = Number(moment().format('H'));
    setPressure_mb((data_today.hours[hour].pressure * 0.75).toFixed(0)); //Давление мм рт сб
  }, [data_today.hours]);

  useEffect(() => {
    const hour = Number(moment().format('H'));

    const arr_1 = [];
    const arr_2 = [];
    const arr_3 = [];

    // arr_1  day-1
    arr_1.push(data_yesterday.hours[22].pressure);
    arr_1.push(data_yesterday.hours[23].pressure);

    // arr_2  day+0
    arr_1.push(...data_today.hours.map(i => i.pressure));

    // arr_3  day+1
    arr_1.push(...data_tomorrow.hours.map(i => i.pressure));

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

    const increase = [
      'В следующем часе будет увеличение',
      'В ближайшие 2 часа ожидается повышение',
      'В ближайшие 3 часа ожидается повышение',
      'В ближайшие 4 часа ожидается повышение',
      'В ближайшие 5 часов ожидается повышение',
      'Давление будет увеличиваться.',
    ];
    const reduction = [
      'В следующем часе будет уменьшение',
      'В ближайшие 2 часа ожидается понижение',
      'В ближайшие 3 часа ожидается понижение',
      'В ближайшие 4 часа ожидается понижение',
      'В ближайшие 5 часов ожидается понижение',
      'Давление будет уменьшаться.',
    ];
    // На текущее время по отношению с предыдущим часом
    if (t2 < t3) {
      setStatusText('Увеличивается');
    }
    if (t2 === t3) {
      setStatusText('Без изменений');
    }
    if (t2 > t3) {
      setStatusText('Уменьшается');
    }
    // -  - - - - - - - - - - - - - - - - - - - - - -
    // Текущее время, относительно будущего
    // Увеличивается
    if (t3 < t4) {
      setStatusDescriptionText(increase[n - 1]);
    }
    // Уменьшается
    if (t3 > t4) {
      setStatusDescriptionText(reduction[n - 1]);
    }
  }, [data_tomorrow.hours, data_today.hours, data_yesterday.hours]);

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
      <p className="item__title">Давление</p>
      <div className="pressure">
        <svg
          width="260"
          height="62"
          viewBox="0 0 260 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="PressureCardGradient" x1="0%" x2="100%">
              <stop offset="0%" stop-color="#96C6FA"></stop>
              <stop offset="74%" stop-color="#A375FF"></stop>
              <stop offset="74%" className="pressure__svg-line"></stop>
            </linearGradient>
          </defs>
          <path
            d={steps}
            stroke="url(#PressureCardGradient)"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <circle
            stroke="#fff"
            stroke-width="3"
            fill="#A375FF"
            cx={valueArr[2].x}
            cy={valueArr[2].y}
            r="10"
          ></circle>
        </svg>
        <div className="pressure__content">
          <p className="content__value">{pressure_mb}</p>
          <div className="content__unit-group">
            <p className="unit-group__name">мм</p>
            <p className="unit-group__time">{datetime} (сейчас)</p>
          </div>
        </div>
      </div>
      <p className="item__text">{statusText}</p>
      <p className="item__sub-text">{statusDescriptionText}</p>
    </div>
  );
};
