import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import Box from '@mui/material/Box';

import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { areaElementClasses, LineChart } from '@mui/x-charts/LineChart';

import moment from 'moment';

export const TempFeelslike = ({ choiceOfDayGlobal, onChange }) => {
  const data = useSelector(weatherSelectors.getWeatherWeek_Data);
  const [chart, setChart] = useState([{ code: 0, value: 1 }]);
  const chartType = 'temp';
  const [choiceOfDay, setChoiceOfDay] = useState(choiceOfDayGlobal);
  const [weeklyData, setWeeklyData] = useState([]);
  console.log('data', data);
  useEffect(() => {
    function colorChartBar(data) {
      const typeMap = {
        temp: [10, 7, 5, 2, 0],
      };

      const colorMap = [
        [101, 62, 146],
        [187, 39, 43],
        [224, 84, 6],
        [212, 143, 2],
        [93, 144, 27],
      ];

      const thresholds = typeMap[chartType];

      for (let i = 0; i < thresholds.length - 1; i++) {
        const top = thresholds[i];
        const bottom = thresholds[i + 1];

        if (data >= bottom && data <= top) {
          const ratio = (data - bottom) / (top - bottom);
          const startColor = colorMap[i + 1];
          const endColor = colorMap[i];

          const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
          const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
          const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);

          return `rgb(${r}, ${g}, ${b})`;
        }
      }

      // Если значение меньше минимального
      return `rgb(${colorMap[colorMap.length - 1].join(',')})`;
    }
    let n = -1;
    let arr;
    const barColors = [];
    arr = data.days[choiceOfDay].hours.map(i => {
      n++;
      let n_text = n;
      if (n < 10) {
        n_text = '0' + n;
      }
      barColors.push(colorChartBar(i[chartType]));
      return {
        code: n_text + ':00',
        value: i[chartType],
        value2: i.feelslike,
      };
    });
    setChart(arr);
  }, [chartType, choiceOfDay, data.days]);

  useEffect(() => {
    if (data.length <= 0) return;
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        dateTime: moment(data.days[i].datetime).format('DD MMMM'),
        dateDay: i === 0 ? 'Вчера' : i === 1 ? 'Сегодня' : moment(data.days[i].datetime).format('dd'),
        feelslike: data.days[i].feelslike,
        tempmax: data.days[i].tempmax,
        tempmin: data.days[i].tempmin,
        ...dataBar(data.days[i].tempmin, data.days[i].tempmax),
      });
    }

    setWeeklyData(arr);
  }, [data]);

  // ------------------------------

  const dataBar = (tempmin, tempmax) => {
    return {
      color: 'linear-gradient(360deg, rgb(243, 253, 134) 0%, rgb(255, 118, 84) 100%)',
      levelQulityHight: `${(tempmax - tempmin) * (66.51 / 21)}px`,
    };
  };

  // ------------------------------
  const handleChoiceOfDay = e => {
    setChoiceOfDay(e.currentTarget.value);
    onChange(e.currentTarget.value);
  };

  const tempValues = chart.map(item => item.value).filter(val => typeof val === 'number');

  const minTemp = Math.min(...tempValues);
  const maxTemp = Math.max(...tempValues);

  const temperatureColors = {
    '-40': '#2F4F4F',
    '-35': '#3D5A6C',
    '-30': '#4169E1',
    '-25': '#4682B4',
    '-20': '#5F9EA0',
    '-15': '#87CEFA',
    '-10': '#ADD8E6',
    '-5': '#B0E0E6',
    0: '#FFD700',
    5: '#FFA500',
    10: '#FF8C00',
    15: '#FF7F50',
    20: '#FF6347',
    25: '#FF4500',
    30: '#DC143C',
    35: '#B22222',
    40: '#8B0000',
    45: '#800000',
    50: '#660000',
  };

  const generateGradientStops = (minTemp, maxTemp) => {
    const gradientStops = [];
    const step = 5;

    for (let temp = minTemp; temp <= maxTemp; temp += step) {
      const rounded = Math.round(temp / step) * step;
      const color = temperatureColors[String(rounded)];

      if (!color) continue;

      const offset = ((temp - minTemp) / (maxTemp - minTemp)) * 100;
      const alpha = offset < 50 ? '80' : '60'; // ← плавная прозрачность
      gradientStops.push({
        offset: `${offset.toFixed(1)}%`,
        color: `${color}${alpha}`, // HEX + прозрачность
      });
    }

    return gradientStops;
  };

  const gradientStops = generateGradientStops(minTemp - 5, maxTemp + 5);

  if (!data?.days) {
    return <div>Загрузка данных о качестве воздуха...</div>;
  }

  return (
    <>
      <div className="weather__air-quality">
        <div className="tabs-carousel-items">
          <div className="tabs-carousel-items" style={{ transform: 'translateX(0px)', columnGap: '10px' }}>
            {weeklyData.map((el, index) => (
              <div
                key={index}
                className={choiceOfDay === `${index}` ? 'tab-daily-item tab-daily-item--active' : 'tab-daily-item'}
              >
                <div className="tab-daily-item__bg ">
                  <div className={choiceOfDay === `${index}` ? 'bg__content bg__content--active' : 'bg__content'}></div>
                </div>
                <button className="tab-daily-item__button" onClick={handleChoiceOfDay} value={index}>
                  <div className="button__content">
                    <div className="content__date-section">
                      <div className="date-section__date-label">{el?.dateTime}</div>
                      <div className="date-section__week-label">{el?.dateDay}</div>
                    </div>
                    <div className="content__content-section" style={{ width: '100%' }}>
                      <div className="content-section__day-bar">
                        <div
                          className="day-bar__bar-val-section"
                          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                        >
                          <div className="bar-val-section__bar-num-big" title="Максимальная температура">
                            {el?.tempmax}°
                          </div>
                          <div className="bar-val-section__bar-num-big-second" title="Минимальная температура">
                            {el?.tempmin}°
                          </div>
                        </div>
                        <div className="day-bar__range-bar-section" title="Дельта температур">
                          <div
                            className="range-bar-section__value-bar"
                            style={{ background: el?.color, height: el?.levelQulityHight }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div
          className="air-quality"
          style={
            choiceOfDay === '0' ? { borderTopLeftRadius: 0 } : choiceOfDay === '4' ? { borderTopRightRadius: 0 } : {}
          }
        >
          <div className="air-quality__chart-content">
            <Box sx={{ width: '100%' }}>
              <LineChart
                sx={theme => ({
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                      stroke: 'var(--color-03)', //stroke: '#fce3af',
                      strokeWidth: 1,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                      fill: 'var(--color-02)',
                    },
                    [`.${areaElementClasses.root}[data-series="value"]`]: {
                      fill: 'url(#dynamicTemperatureGradient)', // ключ — явно задать стиль
                      filter: 'none',
                    },
                    [`& .MuiChartsAxis-label`]: {
                      fill: 'var(--color-03)',
                    },
                  },
                })}
                xAxis={[
                  {
                    scaleType: 'point',
                    dataKey: 'code',
                    position: 'top',
                    tickLabelInterval: (value, index) => index % 2 === 0, // Отображаем каждую вторую подпись
                  },
                ]}
                height={295}
                dataset={chart}
                series={[
                  {
                    dataKey: 'value2',
                    label: 'Ощущается как',
                    color: 'url(#dynamicTemperatureGradient)', // динамическая заливка
                    showMark: false,
                    baseline: 'min',
                    area: true, // Чтобы было с заливкой
                    valueFormatter: value => `${value?.toFixed(2)} °C`,
                  },
                  {
                    dataKey: 'value',
                    label: 'Температура',
                    color: 'rgb(0, 0, 255)',
                    showMark: false,
                    // yAxisId: 'rightAxisId',
                    valueFormatter: value => `${value?.toFixed(2)} °C`,
                  },
                ]}
                slots={{
                  legend: () => null,
                }}
                yAxis={[
                  {
                    valueFormatter: value => `${value}°C`,
                    min: minTemp - 5, // например, 745
                    max: maxTemp + 5, // например, 750
                    label: 'Температура °C',
                  },

                  // {
                  //   id: 'rightAxisId',
                  //   valueFormatter: value2 => `${value2}°C`,
                  //   position: 'right',
                  // },
                ]}
                borderRadius={15} // Добавляем закругление к столбцам
                grid={{ vertical: true, horizontal: true }}
              >
                <defs>
                  <linearGradient id="dynamicTemperatureGradient" x1="0" y1="1" x2="0" y2="0">
                    {gradientStops.map((stop, i) => (
                      <stop key={i} offset={stop.offset} stopColor={stop.color} />
                    ))}
                  </linearGradient>
                </defs>
              </LineChart>
            </Box>
          </div>

          <div className="air-quality__legend-container" style={{ width: 280 }}>
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{
                  background:
                    ' linear-gradient(270deg, #7cbeff 0%, #74d6ff 21%, #bbebb8 42.17%, #fcff77 70.14%, #ff7455 100%)',
                }}
              ></span>
              <span className="item__label" title="Ощущается как">
                <span>Ощущается как</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled-line" style={{ background: 'rgb(0, 0, 255)' }}></span>
              <span className="item__label" title="Температура<">
                <span>Температура</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
