import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getWeatherYesterday_Data, getWeatherToday_Data, getWeatherTomorrow_Data } from 'store/selectors';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const TilesTemperatura = () => {
  const data_yesterday = useSelector(getWeatherYesterday_Data);
  const data_today = useSelector(getWeatherToday_Data);
  const data_tomorrow = useSelector(getWeatherTomorrow_Data);

  const [currentTemperature, setCurrentTemperature] = useState('--');
  const [temperatureSubtext, setTemperatureSubext] = useState('--');
  const [colorSvgTempArea, setColorSvgTempArea] = useState('#18bfca');

  const [dataChart, setDataChart] = useState([0, 0, 0, 1]);
  const [statusText, setStatusText] = useState('--');
  const [statusDescriptionText, setStatusDescriptionText] = useState('--');

  useEffect(() => {
    const hour = Number(moment().format('H'));

    const arr_1 = [];
    const arr_2 = [];
    const arr_3 = [];

    // arr_1  day-1
    const numberOfHoursInAday = data_yesterday.days[0].hours.length;
    arr_1.push(data_yesterday.days[0].hours[numberOfHoursInAday - 3].temp);
    arr_1.push(data_yesterday.days[0].hours[numberOfHoursInAday - 2].temp);

    // arr_2  day+0
    arr_1.push(...data_today.days[0].hours.map(i => i.temp));

    // arr_3  day+1
    arr_1.push(...data_tomorrow.days[0].hours.map(i => i.temp));

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
      'Температура будет увеличиваться.',
    ];
    const reduction = [
      'В следующем часе будет уменьшение',
      'В ближайшие 2 часа ожидается понижение',
      'В ближайшие 3 часа ожидается понижение',
      'В ближайшие 4 часа ожидается понижение',
      'В ближайшие 5 часов ожидается понижение',
      'Температура будет уменьшаться.',
    ];
    // На текущее время по отношению с предыдущим часом
    if (t2 < t3) {
      setStatusText('Увеличивается');
      setColorSvgTempArea('#cc2635');
    }
    if (t2 === t3) {
      setStatusText('Без изменений');
      setColorSvgTempArea('#18bfca');
    }
    if (t2 > t3) {
      setStatusText('Уменьшается');
      setColorSvgTempArea('#18bfca');
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

    setCurrentTemperature(data_today.days[0].hours[hour].temp.toFixed(0));
  }, [data_today.days, data_tomorrow.days, data_yesterday.days]);

  useEffect(() => {
    const hour = Number(moment().format('H'));
    const arr = [...data_today.days[0].hours.map(i => i.temp)]; // Данные за сегодня
    const arr2 = [...data_tomorrow.days[0].hours.map(i => i.temp)]; // Данные за завтра

    const t_max_today = Math.max(...arr.map(i => i)); // максимальная температура сегодня
    const t_max_today_hour = arr.indexOf(t_max_today); // индекс максимальной температуры, равен часу в котором максимальная температура
    const t_min_today = Math.min(...arr.slice(0, t_max_today_hour).map(i => i)); // Минимальная температура сегодня до максимальной
    const t_min_today_hour = arr.indexOf(t_min_today); // Час в котором была минимальная температура до максимальной

    const t_max_tomorrow = Math.max(...arr2.map(i => i)); // максимальная температура завтра
    const t_max_tomorrow_hour = arr2.indexOf(t_max_tomorrow); // индекс максимальной температуры, равен часу в котором максимальная температура
    const t_min_tomorrow = Math.min(...arr.slice(t_max_today_hour), ...arr2.slice(0, t_max_tomorrow_hour).map(i => i)); // минимальная температура между максимум сегодня и завтра
    const t_min_tomorrow_hour =
      [...arr.slice(t_max_today_hour), ...arr2.slice(0, t_max_tomorrow_hour)].indexOf(t_min_tomorrow) +
      t_max_today_hour; // Час в котором был минимум температуры между максимами, счет времени от 0 часов сегодня

    let text = '--';
    if (hour < t_min_tomorrow_hour) {
      const time2min = t_min_tomorrow_hour;
      let time;
      if (time2min < 24) {
        time = time2min;
      } else time = time2min - 24;
      text = 'Минимальная температура ' + t_min_tomorrow + '° ожидается в ' + time + ':00';
    } else if (hour < t_max_today_hour) {
      text = 'Максимальная температура ' + t_max_today + '° ожидается в ' + t_max_today_hour + ':00.';
    } else if (hour < t_min_today_hour) {
      text = 'Минимальная температура ' + t_min_today + '° ожидается в ' + t_min_today_hour + ':00';
    }

    setTemperatureSubext(text);
  }, [data_today.days, data_tomorrow.days]);

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
      x: 240,
      y: dataChart[3],
    },
  ];

  let valueArrArea = [
    {
      x: 0,
      y: dataChart[0],
    },
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
      x: 240,
      y: dataChart[3],
    },
    {
      x: 244,
      y: dataChart[3],
    },
  ];

  function plottingGraph(arr) {
    let steps = [];
    arr.forEach((curr, index) => {
      if (index === 0) steps.push('M' + curr.x + ',' + curr.y);

      if (index !== arr.length - 1) {
        let next = arr[index + 1];
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
    return steps;
  }

  let steps = plottingGraph(valueArr);
  let stepsArea = plottingGraph(valueArrArea);

  const temperaturaArea =
    stepsArea.join(' ') +
    ',L244,115C228.02380952380952,115,212.04761904761907,115,185.44,115C158.83238095238093,115,121.59333333333333,115.00000000000001,97.60000000000001,115C73.60666666666668,114.99999999999999,62.85904761904762,115,48.800000000000004,115C34.740952380952386,115,17.370476190476193,115,0,115Z';

  return (
    <div className="card__item">
      <p className="item__title">Температура</p>
      <div className="temperature">
        <svg width="244" height="115" viewBox="0 0 244 115" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient y2="0%" x2="0%" y1="100%" x1="0%" id="weatherDetailsOpacityGradient">
              <stop stop-color="#c4c4c4" offset="25%" stop-opacity="0.1"></stop>
              <stop stop-color="#c4c4c4" offset="93.56%" stop-opacity="0"></stop>
            </linearGradient>
            <mask id="weatherDetailsOpacityMask">
              <rect fill="url(#weatherDetailsOpacityGradient)" x="0" y="0" width="244" height="115"></rect>
            </mask>
          </defs>
          <defs>
            <linearGradient id="TemperatureCardGradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0" stop-color={colorSvgTempArea}></stop>
              <stop offset="76.00%" stop-color={colorSvgTempArea}></stop>
              <stop offset="76.00%" stop-color="rgb(255 255 255 / 20%)"></stop>
            </linearGradient>
          </defs>
          <defs>
            <path
              id="tempTrendArea"
              d={temperaturaArea}
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </defs>
          <defs>
            <g id="tempTrendPath">
              <path
                d={steps}
                stroke="url('#TemperatureCardGradient')"
                stroke-width="8"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <circle
                stroke="#fff"
                stroke-width="3"
                fill={colorSvgTempArea}
                cx={valueArr[2].x}
                cy={valueArr[2].y}
                r="10"
              ></circle>
            </g>
          </defs>
          <use
            x="0"
            y="0"
            width="244"
            height="115"
            href="#tempTrendArea"
            stroke={colorSvgTempArea}
            fill={colorSvgTempArea}
            className="svg-temperature-area"
          ></use>
          <use
            x="0"
            y="0"
            width="244"
            height="115"
            href="#tempTrendPath"
            style={{ boxShadow: 'rgb(255, 255, 255) 0px 2px 0px inset' }}
          ></use>
          <g className="temperature__value">
            <text x={valueArr[2].x} y={valueArr[2].y + 47}>
              {currentTemperature}°
            </text>
          </g>
        </svg>
      </div>
      <p className="item__text">{statusText}</p>
      <p className="item__sub-text" title={statusDescriptionText + '. ' + temperatureSubtext}>
        {statusDescriptionText}. {temperatureSubtext}
      </p>
    </div>
  );
};
