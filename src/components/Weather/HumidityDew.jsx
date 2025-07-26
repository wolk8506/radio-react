import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import Box from '@mui/material/Box';

import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { areaElementClasses, LineChart } from '@mui/x-charts/LineChart';

import moment from 'moment';

export const HumidityDew = ({ choiceOfDayGlobal, onChange }) => {
  const data = useSelector(weatherSelectors.getWeatherWeek_Data);

  const [chart, setChart] = useState([{ code: 0, value: 1 }]);
  const chartType = 'humidity';
  const [choiceOfDay, setChoiceOfDay] = useState(choiceOfDayGlobal);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    function colorChartBar(data) {
      const typeMap = {
        humidity: [10, 7, 5, 2, 0],
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
        value2: i.dew,
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
        dew: data.days[i].dew,
        humidity: data.days[i].humidity,
        ...dataBar(data.days[i].humidity),
      });
    }

    setWeeklyData(arr);
  }, [data]);

  // ------------------------------

  const dataBar = data => {
    const type = {
      humidity: [100, 80, 60, 40, 20, 0],
    };
    const chartType = 'humidity';

    if (data > type[chartType][0])
      return { color: 'linear-gradient(rgb(24, 169, 201) 0%, rgb(24, 201, 201) 100%)', levelQulityHight: '66.51px' };
    else if (data > type[chartType][1])
      return { color: 'linear-gradient(rgb(24, 169, 201) 0%, rgb(24, 201, 201) 100%)', levelQulityHight: '57.84px' };
    else if (data > type[chartType][2])
      return { color: 'linear-gradient(rgb(24, 169, 201) 0%, rgb(24, 201, 201) 100%)', levelQulityHight: '49.17px' };
    else if (data > type[chartType][3])
      return { color: 'linear-gradient(rgb(24, 169, 201) 0%, rgb(24, 201, 201) 100%)', levelQulityHight: '40.5px' };
    else if (data > type[chartType][4])
      return { color: 'linear-gradient(rgb(24, 169, 201) 0%, rgb(24, 201, 201) 100%)', levelQulityHight: '31.83px' };
    else if (data >= type[chartType][5])
      return { color: 'linear-gradient(rgb(24, 169, 201) 0%, rgb(24, 201, 201) 100%)', levelQulityHight: '23.16px' };
  };

  // ------------------------------
  const handleChoiceOfDay = e => {
    setChoiceOfDay(e.currentTarget.value);
    onChange(e.currentTarget.value);
  };

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
                          <div className="bar-val-section__bar-num-big">{el?.humidity} %</div>
                          <div className="bar-val-section__bar-num-big-second">{el?.dew} °</div>
                        </div>
                        <div className="day-bar__range-bar-section">
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
                    [`& .${areaElementClasses.root}[data-series=${chartType}]`]: {
                      fill: "url('#myGradient')",
                      filter: 'none', // Remove the default filtering
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
                    dataKey: 'value',
                    label: 'Влажность',
                    color: 'url(#myGradient)',
                    showMark: false,
                    area: true,
                    valueFormatter: value => `${value?.toFixed(2)} %`,
                  },
                  {
                    dataKey: 'value2',
                    label: 'Точка росы',
                    color: 'rgb(24, 201, 201)',
                    showMark: false,
                    yAxisId: 'rightAxisId',
                    valueFormatter: value => `${value?.toFixed(2)} °C`,
                  },
                ]}
                slots={{
                  legend: () => null,
                }}
                yAxis={[
                  {
                    valueFormatter: value => `${value}%`,
                    label: 'Влажность, %',
                  },
                  {
                    id: 'rightAxisId',
                    valueFormatter: value2 => `${value2}°C`,
                    position: 'right',
                    label: 'Температура, °C',
                  },
                ]}
                borderRadius={15} // Добавляем закругление к столбцам
                grid={{ vertical: true, horizontal: true }}
              >
                <defs>
                  <linearGradient id="myGradient" gradientTransform="rotate(90)">
                    <stop offset="5%" stopColor="rgb(142 213 255 / 80%)" />
                    <stop offset="95%" stopColor="rgb(142 213 255 / 5%)" />
                  </linearGradient>
                </defs>
              </LineChart>
            </Box>
          </div>

          <div className="air-quality__legend-container" style={{ width: 250 }}>
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{
                  background: 'linear-gradient(rgb(24, 169, 201) 0%, rgb(24, 201, 201) 100%)',
                }}
              ></span>
              <span className="item__label" title="Влажность<">
                <span>Влажность</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled-line" style={{ background: 'rgb(24, 201, 201)' }}></span>
              <span className="item__label" title="Точка росы<">
                <span>Точка росы</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
