// !!!!!!!!!!!!
// !!!!!!!!!!!!   НЕ ИСПОЛЬЗУЕТСЯ СОЗДАН ДЛЯ ДАЛЬНЕЙШЕЙ РАЗРАБОТКИ
// !!!!!!!!!!!!
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { weatherSelectors, weatherOperations } from 'store';

import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

import moment from 'moment';

export const UV = ({ choiceOfDayGlobal, onChange }) => {
  const data = useSelector(weatherSelectors.getWeatherAirQuality_Data);
  // const CITY = useSelector(weatherSelectors.getCityName);
  // const dispatch = useDispatch();
  // const START_DATE = moment().subtract(1, 'days').format('YYYY-MM-DD');
  // const END_DATE = moment().add(5, 'days').format('YYYY-MM-DD');
  // const WEATHER_API_KEY = 'GP4GVCRSPM49PLYL6GG3XCCND';

  const [chart, setChart] = useState([{ code: 0, value: 1 }]);
  const [chartType, setChartType] = useState('aqius');
  const [choiceOfDay, setChoiceOfDay] = useState(choiceOfDayGlobal);
  const [weeklyData, setWeeklyData] = useState([]);
  const [barColors, setbarColors] = useState([]);

  useEffect(() => {
    function colorChartBar(data) {
      const typeMap = {
        aqius: [300, 200, 150, 100, 50, 0],
        co: [30.4, 15.5, 12.5, 9.5, 4.5, 0],
        no2: [340, 230, 120, 90, 40, 0],
        o3: [380, 240, 130, 100, 50, 0],
        pm2p5: [75, 50, 25, 20, 10, 0],
        pm10: [150, 100, 50, 40, 20, 0],
        so2: [750, 500, 350, 200, 100, 0],
        pm1: [50, 30, 20, 10, 5, 0],
      };

      const colorMap = [
        [110, 34, 15],
        [136, 23, 152],
        [209, 52, 56],
        [242, 97, 12],
        [255, 185, 0],
        [0, 174, 86],
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
      barColors.push(colorChartBar(chartType !== 'co' ? i[chartType] : Number(((i.co / 1000) * 0.8729).toFixed(3))));
      return {
        code: n_text + ':00',
        // value: i[chartType],
        value: chartType !== 'co' ? i[chartType] : Number(((i.co / 1000) * 0.8729).toFixed(3)),
      };
    });
    setChart(arr);
    setbarColors(barColors);
  }, [chartType, choiceOfDay, data.days]);

  // console.log(data);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push({
        dateTime: moment(data.days[i].datetime).format('DD MMMM'),
        dateDay: i === 0 ? 'Вчера' : i === 1 ? 'Сегодня' : moment(data.days[i].datetime).format('dd'),
        aqius: data.days[i].aqius,
        ...dataBar(data.days[i].aqius),
      });
    }

    setWeeklyData(arr);
  }, [data]);

  // ------------------------------

  const dataBar = data => {
    const type = {
      aqius: [300, 200, 150, 100, 50, 0],
    };
    const chartType = 'aqius';

    if (data > type[chartType][0])
      return { color: 'rgb(110, 34, 15)', levelQulityTitle: 'Опасное загрязнение', levelQulityHight: '66.51px' };
    else if (data > type[chartType][1])
      return { color: 'rgb(136, 23, 152)', levelQulityTitle: 'Очень вредно для здоровья', levelQulityHight: '57.84px' };
    else if (data > type[chartType][2])
      return { color: 'rgb(209, 52, 56)', levelQulityTitle: 'Вредно для здоровья', levelQulityHight: '49.17px' };
    else if (data > type[chartType][3])
      return { color: 'rgb(242, 97, 12)', levelQulityTitle: 'Плохое', levelQulityHight: '40.5px' };
    else if (data > type[chartType][4])
      return { color: 'rgb(255, 185, 0)', levelQulityTitle: 'Среднее', levelQulityHight: '31.83px' };
    else if (data >= type[chartType][5])
      return { color: 'rgb(0, 174, 86)', levelQulityTitle: 'Хорошее', levelQulityHight: '23.16px' };
  };

  // ------------------------------
  const handleChoiceOfDay = e => {
    setChoiceOfDay(e.currentTarget.value);
    onChange(e.currentTarget.value);
  };

  const handleAirQualityChoice = e => {
    setChartType(e.currentTarget.value);
  };

  // console.log(chart);

  const buttonGroup = [
    { value: 'aqius', title: 'Индекс качества воздуха' },
    { value: 'o3', title: 'O₃' },
    { value: 'pm2p5', title: 'PM 2,5' },
    { value: 'pm10', title: 'PM 10' },
    { value: 'no2', title: 'NO₂' },
    { value: 'co', title: 'CO' },
    { value: 'so2', title: 'SO₂' },
    { value: 'pm1', title: 'PM 1' },
  ];

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
                          <div className="bar-val-section__bar-num-big">{el?.aqius}</div>
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
          <div className="air-quality__button-group">
            {buttonGroup.map(el => (
              <button
                key={el.value}
                className={
                  chartType !== el.value
                    ? `button-group__button-air`
                    : 'button-group__button-air button-group__button-air--activ'
                }
                onClick={handleAirQualityChoice}
                value={el.value}
                title={el.title}
                aria-label={el.title}
              >
                <span>{el.title}</span>
              </button>
            ))}
          </div>

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
                series={[{ dataKey: 'value', label: chartType }]}
                slots={{
                  legend: () => null,
                }}
                yAxis={[
                  {
                    valueFormatter: value => value,
                  },
                ]}
                borderRadius={15} // Добавляем закругление к столбцам
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </div>

          <div className="air-quality__legend-container">
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(0, 174, 86)' }}></span>
              <span className="item__label" title="Хорошее">
                <span> Хорошее</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(255, 185, 0)' }}></span>
              <span className="forecastLegendLabel-DS-EntryPoint1-1" title="Среднее">
                <span> Среднее</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(242, 97, 12)' }}></span>
              <span className="forecastLegendLabel-DS-EntryPoint1-1" title="Плохое">
                <span> Плохое</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(209, 52, 56)' }}></span>
              <span className="forecastLegendLabel-DS-EntryPoint1-1" title="Вредно для здоровья">
                <span> Вредно для здоровья</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(136, 23, 152)' }}></span>
              <span className="forecastLegendLabel-DS-EntryPoint1-1" title="Очень вредно для здоровья">
                <span> Очень вредно для здоровья</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled" style={{ background: 'rgb(110, 34, 15)' }}></span>
              <span className="forecastLegendLabel-DS-EntryPoint1-1" title="Опасное загрязнение">
                <span> Опасное загрязнение</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
