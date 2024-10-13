import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

export const TilesTemperatura = () => {
  // const data15 = useSelector(state => state.storeWeather15);
  // const dataLast = useSelector(state => state.storeWeatherLastDay);

  const data_yesterday = useSelector(
    state => state.storeWeatherLastDay.yesterday.days[0]
  );
  const data_today = useSelector(
    state => state.storeWeatherLastDay.today.days[0]
  );
  const data_tomorrow = useSelector(
    state => state.storeWeatherLastDay.tomorrow.days[0]
  );

  const [arr3, setArr3] = useState([0, 0, 0, 0]);
  const [currentTemperature, setCurrentTemperature] = useState('--');
  const [temperatureText, setTemperatureText] = useState('--');
  const [temperatureSubtext, setTemperatureSubext] = useState('--');
  const [tempMinText, setTempMinText] = useState('--');
  const [tempMaxHour, setTempMaxHour] = useState('--');
  const [tempMaxText, setTempMaxText] = useState('--');
  const [colorSvgTempArea, setColorSvgTempArea] = useState('#18bfca');

  useEffect(() => {
    // const numberDay = moment().isoWeekday();
    const arr = [];
    const arr2 = [];
    data_today.hours.map(i => arr.push(i.temp));
    data_tomorrow.hours.map(i => arr2.push(i.temp));

    const t_max = Math.max(...arr.map(i => i));
    const indexHourMax = arr.indexOf(t_max);
    const indexHourMax2 = arr.indexOf(t_max);

    const arr3 = [
      ...arr.slice(indexHourMax - 24),
      ...arr2.slice(0, indexHourMax2),
    ];
    const t_min = Math.min(...arr3.map(i => i));
    const indexHourMin = arr3.indexOf(t_min);
    const bb = indexHourMax + indexHourMin - 24;

    setTempMinText(
      'Минимальная температура ' + t_min + '° ожидается в ' + bb + ':00'
    );
    setTempMaxHour(indexHourMax);
    setTempMaxText(
      'Максимальная температура ' +
        t_max +
        '° ожидается в ' +
        indexHourMax +
        ':00.'
    );
  }, [data_today.hours, data_tomorrow.hours]);

  useEffect(() => {
    // const numberDay = moment().isoWeekday();
    const hour = Number(moment().format('H'));
    // const hour = 8;
    // const temperaturaLastDay = dataLast.days[6].tempmax;
    // const t = data15.days[0].hours[0].temp;
    // let t0 = (temperaturaLastDay - t) / 3 / 3;
    // const t_22 = data15.days[numberDay - 1].hours[22].temp;
    const t_23 = data_yesterday.hours[23].temp;

    if (hour === 0) {
      const t1 = data_yesterday.hours[22].temp;
      const t2 = data_yesterday.hours[23].temp;
      const t3 = data_today.hours[hour].temp;
      const t4 = data_today.hours[hour + 1].temp;
      const arr = [t1, t2, t3, t4];
      const t_min = Math.min(...arr.map(i => i));
      const t_max = Math.max(...arr.map(i => i));
      const step = 50 / (t_max - t_min);
      const arr2 = arr.map(i => {
        return (t_max - i) * step + 20;
      });
      setArr3(arr2);
      setCurrentTemperature(t3.toFixed(0));

      const b = Number((t4 - t3).toFixed(1));
      if (b < 0) {
        if (b <= -0.5) {
          setTemperatureText('Уменьшается');
          setColorSvgTempArea('#18bfca');
        }
        if (b > -0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        }
      }
      if (b > 0) {
        if (b < 0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        } else if (b >= 0.5) {
          setTemperatureText('Увеличивается');
          setColorSvgTempArea('#cc2635');
        }
      }
      if (b === 0) {
        setTemperatureText('Без изменений');
        setColorSvgTempArea('#18bfca');
      }
      setTemperatureSubext(tempMaxText);
    }
    if (hour === 1) {
      const t1 = t_23;
      const t2 = data_yesterday.hours[hour - 1].temp;
      const t3 = data_today.hours[hour].temp;
      const t4 = data_today.hours[hour + 1].temp;

      const arr = [t1, t2, t3, t4];
      const t_min = Math.min(...arr.map(i => i));
      const t_max = Math.max(...arr.map(i => i));
      const step = 50 / (t_max - t_min);
      const arr2 = arr.map(i => {
        return (t_max - i) * step + 20;
      });
      setArr3(arr2);
      setCurrentTemperature(t3.toFixed(0));
      const b = Number((t4 - t3).toFixed(1));
      if (b < 0) {
        if (b <= -0.5) {
          setTemperatureText('Уменьшается');
          setColorSvgTempArea('#18bfca');
        }
        if (b > -0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        }
      }
      if (b > 0) {
        if (b < 0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        } else if (b >= 0.5) {
          setTemperatureText('Увеличивается');
          setColorSvgTempArea('#cc2635');
        }
      }
      if (b === 0) {
        setTemperatureText('Без изменений');
        setColorSvgTempArea('#18bfca');
      }
      setTemperatureSubext(tempMaxText);
    }

    if (hour > 1 && hour < 23) {
      const t1 = data_today.hours[hour - 2].temp;
      const t2 = data_today.hours[hour - 1].temp;
      const t3 = data_today.hours[hour].temp;
      const t4 = data_today.hours[hour + 1].temp;

      const arr = [t1, t2, t3, t4];
      const t_min = Math.min(...arr.map(i => i));
      const t_max = Math.max(...arr.map(i => i));
      const step = 50 / (t_max - t_min);
      const arr2 = arr.map(i => {
        return (t_max - i) * step + 20;
      });
      setArr3(arr2);
      setCurrentTemperature(t3.toFixed(0));
      const b = Number((t4 - t3).toFixed(1));
      if (b < 0) {
        if (b <= -0.5) {
          setTemperatureText('Уменьшается');
          setColorSvgTempArea('#18bfca');
        }
        if (b > -0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        }
      }
      if (b > 0) {
        if (b < 0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        } else if (b >= 0.5) {
          setTemperatureText('Увеличивается');
          setColorSvgTempArea('#cc2635');
        }
      }
      if (b === 0) {
        setTemperatureText('Без изменений');
        setColorSvgTempArea('#18bfca');
      }
      if (tempMaxHour <= hour) {
        setTemperatureSubext(tempMinText);
      } else setTemperatureSubext(tempMaxText);
    }
    if (hour === 23) {
      const t1 = data_today.hours[hour - 2].temp;
      const t2 = data_today.hours[hour - 1].temp;
      const t3 = data_today.hours[hour].temp;
      const t4 = data_tomorrow.hours[0].temp;

      const arr = [t1, t2, t3, t4];
      const t_min = Math.min(...arr.map(i => i));
      const t_max = Math.max(...arr.map(i => i));
      const step = 50 / (t_max - t_min);
      const arr2 = arr.map(i => {
        return (t_max - i) * step + 20;
      });
      setArr3(arr2);
      setCurrentTemperature(t3.toFixed(0));
      const b = Number((t4 - t3).toFixed(1));
      if (b < 0) {
        if (b <= -0.5) {
          setTemperatureText('Уменьшается');
          setColorSvgTempArea('#18bfca');
        }
        if (b > -0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        }
      }
      if (b > 0) {
        if (b < 0.5) {
          setTemperatureText('Без изменений');
          setColorSvgTempArea('#18bfca');
        } else if (b >= 0.5) {
          setTemperatureText('Увеличивается');
          setColorSvgTempArea('#cc2635');
          // #cc2635
        }
      }
      if (b === 0) {
        setTemperatureText('Без изменений');
        setColorSvgTempArea('#18bfca');
      }
      setTemperatureSubext(tempMinText);
    }
  }, [
    data_today.hours,
    data_tomorrow.hours,
    data_yesterday.hours,
    tempMaxHour,
    tempMaxText,
    tempMinText,
  ]);

  let valueArr = [
    {
      x: 4,
      y: arr3[0],
    },
    {
      x: 90,
      y: arr3[1],
    },
    {
      x: 180,
      y: arr3[2],
    },
    {
      x: 240,
      y: arr3[3],
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

  let valueArrArea = [
    {
      x: 0,
      y: arr3[0],
    },
    {
      x: 4,
      y: arr3[0],
    },
    {
      x: 90,
      y: arr3[1],
    },
    {
      x: 180,
      y: arr3[2],
    },
    {
      x: 240,
      y: arr3[3],
    },
    {
      x: 244,
      y: arr3[3],
    },
  ];

  let stepsArea = [];

  valueArrArea.forEach((curr, index) => {
    if (index === 0) {
      // 移动到起点
      stepsArea.push('M' + curr.x + ',' + curr.y);
    }
    if (index !== valueArrArea.length - 1) {
      let next = valueArrArea[index + 1];
      // 两个控制点坐标
      var ctrl1 = {
        x: (curr.x + next.x) * 0.5,
        y: curr.y,
      };
      var ctrl2 = {
        x: ctrl1.x,
        y: next.y,
      };
      stepsArea.push('C' + ctrl1.x + ',' + ctrl1.y);
      stepsArea.push(ctrl2.x + ',' + ctrl2.y);
      stepsArea.push(next.x + ',' + next.y);
    }
  });

  let svgP = steps;
  const temperaturaArea =
    stepsArea.join(' ') +
    ',L244,115C228.02380952380952,115,212.04761904761907,115,185.44,115C158.83238095238093,115,121.59333333333333,115.00000000000001,97.60000000000001,115C73.60666666666668,114.99999999999999,62.85904761904762,115,48.800000000000004,115C34.740952380952386,115,17.370476190476193,115,0,115Z';

  return (
    <div className="card__item">
      <p className="item__title">Температура</p>
      <div className="temperature">
        <svg
          width="244"
          height="115"
          viewBox="0 0 244 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              y2="0%"
              x2="0%"
              y1="100%"
              x1="0%"
              id="weatherDetailsOpacityGradient"
            >
              <stop stop-color="#c4c4c4" offset="25%" stop-opacity="0.1"></stop>
              <stop
                stop-color="#c4c4c4"
                offset="93.56%"
                stop-opacity="0"
              ></stop>
            </linearGradient>
            <mask id="weatherDetailsOpacityMask">
              <rect
                fill="url(#weatherDetailsOpacityGradient)"
                x="0"
                y="0"
                width="244"
                height="115"
              ></rect>
            </mask>
          </defs>
          <defs>
            <linearGradient
              id="TemperatureCardGradient"
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0" stop-color={colorSvgTempArea}></stop>
              <stop offset="76.00%" stop-color={colorSvgTempArea}></stop>
              <stop
                offset="76.00%"
                stop-color="rgb(255 255 255 / 20%)"
                // className="tempLineBackground-DS-EntryPoint1-1"
              ></stop>
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
                d={svgP}
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
      <p className="item__text">{temperatureText}</p>
      <p className="item__sub-text" title={temperatureSubtext}>
        {temperatureSubtext}
      </p>
    </div>
  );
};
