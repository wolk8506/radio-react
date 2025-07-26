import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import Box from '@mui/material/Box';
import { BarPlot } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import moment from 'moment';
import { ChartContainer, ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis, LinePlot } from '@mui/x-charts';
import { CustomBar } from './CustomBar';

export const Precip = ({ choiceOfDayGlobal, onChange }) => {
  const data = useSelector(weatherSelectors.getWeatherWeek_Data);

  const [chart, setChart] = useState([{ code: 0, value: 1 }]);
  const chartType = 'precipprob';
  const [choiceOfDay, setChoiceOfDay] = useState(choiceOfDayGlobal);
  const [weeklyData, setWeeklyData] = useState([]);
  // const [barColors, setbarColors] = useState([]);

  useEffect(() => {
    let n = -1;
    // const barColors = [];

    let sumValue = 0;
    const arr = data.days[choiceOfDay].hours.map((i, index) => {
      n++;
      const n_text = n < 10 ? '0' + n : String(n);

      const barColor = (() => {
        const typeSet = new Set(Array.isArray(i.preciptype) ? i.preciptype : [i.preciptype]);

        if (typeSet.has('snow') && typeSet.size === 1) return 'snow';
        if ((typeSet.has('rain') || typeSet.has('freezingrain')) && !typeSet.has('snow') && !typeSet.has('ice'))
          return 'rain';
        if (
          (typeSet.has('snow') && (typeSet.has('rain') || typeSet.has('freezingrain'))) ||
          (typeSet.has('ice') && typeSet.has('freezingrain'))
        )
          return 'mix';

        return 'rain'; // ← Дефолтное значение
      })();

      sumValue += i.precip;

      return {
        code: n_text + ':00',
        value: sumValue,
        value2: i.precip,
        isHighlighted: true,
        barColor,
      };
    });

    setChart(arr);
    // setbarColors(barColors);
  }, [chartType, choiceOfDay, data.days]);

  useEffect(() => {
    if (data.length <= 0) return;
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        dateTime: moment(data.days[i].datetime).format('DD MMMM'),
        dateDay: i === 0 ? 'Вчера' : i === 1 ? 'Сегодня' : moment(data.days[i].datetime).format('dd'),
        precipprob: data.days[i].precipprob,
        precip: data.days[i].precip,
        ...dataBar(data.days[i].preciptype, data.days[i].hours.filter(hour => hour.precip > 0).length),
      });
    }

    setWeeklyData(arr);
  }, [data]);

  // ------------------------------

  const dataBar = (preciptype, precip) => {
    const barColor = (() => {
      const typeSet = new Set(Array.isArray(preciptype) ? preciptype : [preciptype]);

      if (typeSet.has('snow') && typeSet.size === 1)
        return 'linear-gradient(rgb(94, 170, 247) 0%, rgb(199, 227, 255) 100%)';
      if ((typeSet.has('rain') || typeSet.has('freezingrain')) && !typeSet.has('snow') && !typeSet.has('ice'))
        return 'linear-gradient(rgb(26, 67, 240) 0%, rgb(110, 132, 254) 100%)';
      if (
        (typeSet.has('snow') && (typeSet.has('rain') || typeSet.has('freezingrain'))) ||
        (typeSet.has('ice') && typeSet.has('freezingrain'))
      )
        return 'linear-gradient(rgb(82, 223, 255) 0%, rgb(189, 243, 255) 100%';

      return 'linear-gradient(rgb(26, 67, 240) 0%, rgb(110, 132, 254) 100%)'; // ← Дефолтное значение
    })();

    return {
      color: barColor,
      levelQulityHight: `${(66.51 / 24) * precip}px`,
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
                          <div className="bar-val-section__bar-num-big" title="Количество осадков за день">
                            {el?.precip}мм
                          </div>
                          <div className="bar-val-section__bar-num-big-second" title="Вероятность осадков">
                            {el?.precipprob}%
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
              <ChartContainer
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
                series={[
                  {
                    type: 'bar',
                    dataKey: 'value2',
                    label: 'Осадки за час',
                    yAxisId: 'leftAxis',
                    colorField: 'barColor',
                    valueFormatter: value => `${value?.toFixed(2)} мм`,
                  },
                  {
                    type: 'line',
                    dataKey: 'value',
                    label: 'Накопление',
                    yAxisId: 'leftAxis',
                    color: 'rgb(104, 201, 255)',
                    showMark: false,
                    valueFormatter: value => `${value?.toFixed(2)} мм`,
                  },
                ]}
                xAxis={[
                  {
                    dataKey: 'code',
                    scaleType: 'band',
                    categoryGapRatio: 0.45,
                    position: 'top',
                    tickLabelInterval: (value, index) => index % 2 === 0,
                  },
                ]}
                yAxis={[
                  {
                    id: 'leftAxis',
                    position: 'left',
                    min: 0,
                    max: chart[23]?.value === 0 ? 1 : chart[23]?.value + 0.1,
                  },
                ]}
                dataset={chart}
                height={300}
              >
                <ChartsXAxis />
                <ChartsYAxis
                  axisId="leftAxis"
                  label="Осадки (mm)"
                  // sx={{
                  //   '& .MuiChartsAxis-label': {
                  //     fill: 'var(--color-03)', // ← цвет текста
                  //   },
                  // }}
                />
                <ChartsGrid horizontal vertical />

                <ChartsTooltip />
                <LinePlot />
                <BarPlot
                  borderRadius={15}
                  slots={{
                    bar: props => <CustomBar {...props} dataset={chart} />,
                  }}
                />
                <svg width={0} height={0}>
                  <defs>
                    <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B000E6" />
                      <stop offset="100%" stopColor="#4682B4" />
                    </linearGradient>
                    <linearGradient id="rain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(26, 67, 240)" />
                      <stop offset="100%" stopColor="rgb(110, 132, 254)" />
                    </linearGradient>
                    <linearGradient id="mix" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D8BFD8" />
                      <stop offset="100%" stopColor="#FF69B4" />
                    </linearGradient>
                  </defs>
                </svg>
              </ChartContainer>
            </Box>
          </div>

          <div className="air-quality__legend-container" style={{ width: 500 }}>
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{
                  background: 'linear-gradient(rgb(26, 67, 240) 0%, rgb(110, 132, 254) 100%)',
                }}
              ></span>
              <span className="item__label" title="Дождь">
                <span>Дождь</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{ background: 'linear-gradient(rgb(94, 170, 247) 0%, rgb(199, 227, 255) 100%)' }}
              ></span>
              <span className="item__label" title="Снег<">
                <span>Снег</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{ background: 'linear-gradient(rgb(82, 223, 255) 0%, rgb(189, 243, 255) 100%' }}
              ></span>
              <span className="item__label" title="Дождь и снег">
                <span>Дождь и снег</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled-line" style={{ background: 'rgb(104, 201, 255)' }}></span>
              <span className="item__label" title="Наполнение">
                <span>Наполнение</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
