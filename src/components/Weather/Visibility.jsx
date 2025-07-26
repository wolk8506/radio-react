import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import Box from '@mui/material/Box';

import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { areaElementClasses, LineChart } from '@mui/x-charts/LineChart';
import { useDrawingArea, useYScale } from '@mui/x-charts';
import moment from 'moment';

function GradientDefs({ min, max }) {
  // eslint-disable-next-line no-unused-vars
  const { height, top } = useDrawingArea();
  const yScale = useYScale();

  const y1 = yScale(max); // верхняя граница (в пикселях)
  const y2 = yScale(min); // нижняя граница

  return (
    <defs>
      <linearGradient id="myGradient" gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
        <stop offset="0%" stopColor="rgb(85 177 126 / 80%)" />
        <stop offset="100%" stopColor="rgb(85 177 126 / 5%)" />
      </linearGradient>
    </defs>
  );
}

export const Visibility = ({ choiceOfDayGlobal, onChange }) => {
  const data = useSelector(weatherSelectors.getWeatherWeek_Data);

  const [chart, setChart] = useState([{ code: 0, value: 1 }]);
  const chartType = 'visibility';
  const [choiceOfDay, setChoiceOfDay] = useState(choiceOfDayGlobal);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    function colorChartBar(data, chartType = 'visibility') {
      const typeMap = {
        visibility: [50, 20, 10, 4, 2, 1, 0.5, 0.2, 0.05, 0],
      };

      const colorMap = [
        [101, 62, 146],
        [187, 39, 43],
        [224, 84, 6],
        [212, 143, 2],
        [93, 144, 27],
        // можно дополнить, чтобы соответствовать длине thresholds
      ];

      const thresholds = typeMap[chartType];
      if (!thresholds) {
        console.warn(`chartType '${chartType}' не определен в typeMap`);
        return `rgb(${colorMap[colorMap.length - 1].join(',')})`;
      }

      for (let i = 0; i < thresholds.length - 1; i++) {
        const top = thresholds[i];
        const bottom = thresholds[i + 1];

        if (data >= bottom && data <= top) {
          const ratio = (data - bottom) / (top - bottom);
          const startColor = colorMap[i + 1] || colorMap[colorMap.length - 1];
          const endColor = colorMap[i] || colorMap[colorMap.length - 1];

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
        value: Number((i.visibility * 0.75).toFixed(0)),
        // value2: (i.visibility * 0.75).toFixed(0),
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
        // dew: data.days[i].dew,
        visibility: (data.days[i]?.visibility * 0.75).toFixed(0),
        ...dataBar((data.days[i]?.visibility * 0.75).toFixed(0)),
      });
    }

    setWeeklyData(arr);
  }, [data]);

  // ------------------------------

  const dataBar = data => {
    const type = {
      visibility: [50, 20, 10, 4, 2, 1, 0.5, 0.2, 0.05, 0],
    };
    const chartType = 'visibility';

    if (data > type[chartType][0])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Свыше 50 км. Исключительная видимость. Горизонт виден четко, воздух прозрачный.',
        levelQulityHight: '66.51px',
      };
    else if (data > type[chartType][1])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Очень хорошая видимость. Горизонт виден резко.',
        levelQulityHight: '60.785px',
      };
    else if (data > type[chartType][2])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Хорошая видимость. Виден горизонт.',
        levelQulityHight: '55.41px',
      };
    else if (data > type[chartType][3])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Легкая дымка, мгла, слабый дождь.',
        levelQulityHight: '50.035px',
      };
    else if (data > type[chartType][4])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Дымка, мгла, дождь.',
        levelQulityHight: '44.66px',
      };
    else if (data >= type[chartType][5])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Средняя видимость. Снег, сильный дождь.',
        levelQulityHight: '39.285px',
      };
    else if (data >= type[chartType][6])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Дымка, густая мгла, снег.',
        levelQulityHight: '33.91px',
      };
    else if (data >= type[chartType][7])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Плохая видимость. Туман, мокрый снег.',
        levelQulityHight: '28.535px',
      };
    else if (data >= type[chartType][8])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Плохая видимость. Густой туман или мокрый снег.',
        levelQulityHight: '28.535px',
      };
    else if (data >= type[chartType][9])
      return {
        color: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
        levelQulityTitle: 'Очень плохая видимость. Густой туман или пурга.',
        levelQulityHight: '23.16px',
      };
  };

  // ------------------------------
  const handleChoiceOfDay = e => {
    setChoiceOfDay(e.currentTarget.value);
    onChange(e.currentTarget.value);
  };

  if (!data?.days) {
    return <div>Загрузка данных о качестве воздуха...</div>;
  }

  const values = chart.map(p => p.value);
  const dataChartMin = Math.min(...values) - 1;
  const dataChartMax = Math.max(...values) + 1;

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
                          <div className="bar-val-section__bar-num-big">{el?.visibility} км</div>
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
                    label: 'Видимость',
                    color: 'url(#myGradient)',
                    showMark: false,
                    area: true,

                    valueFormatter: value => `${value?.toFixed(2)} км`,
                  },
                ]}
                slots={{
                  legend: () => null,
                }}
                yAxis={[
                  {
                    min: dataChartMin, // например, 745
                    max: dataChartMax, // например, 750
                    valueFormatter: value => `${value}км`,
                    label: 'Видимость, км',
                  },
                ]}
                borderRadius={15} // Добавляем закругление к столбцам
                grid={{ vertical: true, horizontal: true }}
              >
                <GradientDefs min={dataChartMin} max={dataChartMax} />
                {/* <defs>
                  <linearGradient id="myGradient" gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
                    <stop offset="0%" stopColor="rgb(154 152 255 / 80%)" />
                    <stop offset="100%" stopColor="rgb(154 152 255 / 5%)" />
                  </linearGradient>
                </defs> */}
              </LineChart>
            </Box>
          </div>

          <div className="air-quality__legend-container" style={{ width: 250 }}>
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{
                  background: 'linear-gradient(rgb(85, 177, 126) 0%, rgba(85, 177, 126, 0.2) 100%)',
                }}
              ></span>
              <span className="item__label" title="Видимость<">
                <span>Видимость</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
