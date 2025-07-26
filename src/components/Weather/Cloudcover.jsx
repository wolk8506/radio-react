import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import moment from 'moment';

export const Cloudcover = ({ choiceOfDayGlobal, onChange }) => {
  const data = useSelector(weatherSelectors.getWeatherWeek_Data);

  const [chart, setChart] = useState([{ code: 0, value: 1 }]);
  const chartType = 'cloudcover';
  const [choiceOfDay, setChoiceOfDay] = useState(choiceOfDayGlobal);
  const [weeklyData, setWeeklyData] = useState([]);
  const [barColors, setbarColors] = useState([]);

  useEffect(() => {
    function colorChartBar(data) {
      const typeMap = {
        cloudcover: [100, 70, 50, 20, 0],
      };

      const colorMap = [
        [178, 209, 255],
        [128, 178, 255],
        [51, 133, 255],
        [0, 85, 212],
        [0, 54, 135],
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
      };
    });
    setChart(arr);
    setbarColors(barColors);
  }, [chartType, choiceOfDay, data.days]);

  useEffect(() => {
    if (data.length <= 0) return;
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        dateTime: moment(data.days[i].datetime).format('DD MMMM'),
        dateDay: i === 0 ? 'Вчера' : i === 1 ? 'Сегодня' : moment(data.days[i].datetime).format('dd'),
        cloudcover: data.days[i].cloudcover,
        ...dataBar(data.days[i].cloudcover),
      });
    }

    setWeeklyData(arr);
  }, [data]);

  // ------------------------------

  const dataBar = data => {
    const type = {
      cloudcover: [100, 70, 50, 20, 0],
    };
    const chartType = 'cloudcover';

    if (data > type[chartType][0])
      return { color: 'rgb(178, 209, 255)', levelQulityTitle: 'Облачно', levelQulityHight: '66.51px' };
    else if (data > type[chartType][1])
      return { color: 'rgb(128, 178, 255)', levelQulityTitle: 'Преимущественно облачно', levelQulityHight: '55.8px' };
    else if (data > type[chartType][2])
      return { color: 'rgb(51, 133, 255)', levelQulityTitle: 'Переменная облачность', levelQulityHight: '45.6px' };
    else if (data > type[chartType][3])
      return { color: 'rgb(0, 85, 212)', levelQulityTitle: 'В основном ясно"', levelQulityHight: '35.4px' };
    else if (data >= type[chartType][4])
      return { color: 'rgb(0, 54, 135)', levelQulityTitle: 'Ясно', levelQulityHight: '25.2px' };
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
                          <div className="bar-val-section__bar-num-big">{el?.cloudcover}%</div>
                          <div className="bar-val-section__bar-level-big">
                            <div className="bar-level-big__bar-level" title={el?.levelQulityTitle}>
                              {el?.levelQulityTitle}
                            </div>
                          </div>
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
              <BarChart
                sx={theme => ({
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                      stroke: 'var(--color-03)', //stroke: '#fce3af',
                      strokeWidth: 1,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                      fill: 'var(--color-02)',
                    },
                    [`& .MuiChartsAxis-label`]: {
                      fill: 'var(--color-03)',
                    },
                  },
                })}
                xAxis={[
                  {
                    categoryGapRatio: 0.45,
                    scaleType: 'band',
                    dataKey: 'code',
                    position: 'top',
                    colorMap: {
                      type: 'ordinal',
                      colors: barColors,
                    },

                    tickLabelInterval: (value, index) => index % 2 === 0, // Отображаем каждую вторую подпись
                  },
                ]}
                height={295}
                dataset={chart}
                series={[{ dataKey: 'value', label: 'Облачность', valueFormatter: value => `${value?.toFixed(2)} %` }]}
                slots={{
                  legend: () => null,
                }}
                yAxis={[
                  {
                    valueFormatter: value => value + '%',
                    label: 'Покрытие облаками, %',
                  },
                ]}
                borderRadius={15} // Добавляем закругление к столбцам
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </div>

          <div className="air-quality__legend-container">
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{
                  background: 'rgb(0, 54, 135)',
                }}
              ></span>
              <span className="item__label" title="Ясно<">
                <span>Ясно</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(0, 85, 212)' }}></span>
              <span className="item__label" title="В основном ясно">
                <span>В основном ясно</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(51, 133, 255)' }}></span>
              <span className="item__label" title="Переменная облачность">
                <span>Переменная облачность</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(128, 178, 255)' }}></span>
              <span className="item__label" title="Преимущественно облачно">
                <span>Преимущественно облачно</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(178, 209, 255)' }}></span>
              <span className="item__label" title="Облачно">
                <span>Облачно</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
