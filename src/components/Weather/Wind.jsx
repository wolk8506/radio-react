import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import Box from '@mui/material/Box';

import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { areaElementClasses, LineChart } from '@mui/x-charts/LineChart';

import moment from 'moment';

export const Wind = ({ choiceOfDayGlobal, onChange }) => {
  const data = useSelector(weatherSelectors.getWeatherWeek_Data);

  console.log('WEEK', data);

  const [chart, setChart] = useState([{ code: 0, value: 1 }]);
  const chartType = 'windspeed';
  const [choiceOfDay, setChoiceOfDay] = useState(choiceOfDayGlobal);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    function colorChartBar(data) {
      const typeMap = {
        windspeed: [10, 7, 5, 2, 0],
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
        value: Number((i[chartType] / 3.6).toFixed(1)),
        value2: Number((i.windgust / 3.6).toFixed(1)),
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
        windgust: (data.days[i].windgust / 3.6).toFixed(0),
        windspeed: (data.days[i].windspeed / 3.6).toFixed(0),
        ...dataBar((data.days[i].windspeed / 3.6).toFixed(0)),
      });
    }

    setWeeklyData(arr);
  }, [data]);

  // ------------------------------

  const dataBar = data => {
    const type = {
      windspeed: [64, 56, 48, 41, 34, 28, 22, 17, 11, 7, 4, 1, 0],
    };
    const chartType = 'windspeed';
    console.log(data);

    if (data > type[chartType][0])
      return {
        color: '#D5102D',
        levelQulityTitle: 'Ураган',
        levelQulitySubtitle:
          'Огромные разрушения, серьёзно повреждены здания, строения и дома, деревья вырваны с корнями, растительность уничтожена. Случай крайне редкий.',

        levelQulityHight: '66.51px',
      };
    else if (data > type[chartType][1])
      return {
        color: '#ED2912',
        levelQulityTitle: 'Жестокий шторм',
        levelQulitySubtitle: 'Большие разрушения на значительном пространстве. Наблюдается очень редко.',
        levelQulityHight: `${11 * 3.9409 + 23.16}px`,
      };
    else if (data > type[chartType][2])
      return {
        color: '#ED6312',
        levelQulityTitle: 'Сильный шторм',
        levelQulitySubtitle:
          'Значительные разрушения, ветер валит мелкие деревья и вырывает их с корнем. На суше наблюдается редко.',
        levelQulityHight: `${10 * 3.9409 + 23.16}px`,
      };
    else if (data > type[chartType][3])
      return {
        color: '#ED8F12',
        levelQulityTitle: 'Шторм',
        levelQulitySubtitle:
          'Гнутся большие деревья, ломаются ветки и сучья. Небольшие повреждения, ветер срывает черепицу, дымовые трубы и шифер с крыш.',
        levelQulityHight: `${9 * 3.9409 + 23.16}px`,
      };
    else if (data > type[chartType][4])
      return {
        color: '#EDC212',
        levelQulityTitle: 'Очень крепкий ветер',
        levelQulitySubtitle:
          'Ветер ломает тонкие ветви и сухие сучья деревьев, говорить на ветру нельзя, идти против ветра очень трудно.',
        levelQulityHight: `${8 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][5])
      return {
        color: '#DAED12',
        levelQulityTitle: 'Крепкий ветер',
        levelQulitySubtitle: 'Качаются большие деревья, гнутся сучья, трудно идти против ветра.',
        levelQulityHight: `${7 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][6])
      return {
        color: '#A4ED12',
        levelQulityTitle: 'Сильный ветер',
        levelQulitySubtitle:
          'Качаются средние стволы и толстые сучья деревьев, тонкие деревья гнутся, гудят телеграфные провода, трудно пользоваться зонтом.',
        levelQulityHight: `${6 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][7])
      return {
        color: '#73ED12',
        levelQulityTitle: 'Свежий ветер',
        levelQulitySubtitle:
          'Ветер свистит в ушах, переносит пыль и мусор. Движение ветра ощущается рукой, качаются тонкие стволы и средние сучья деревьев, вытягиваются и полощут большие флаги.',
        levelQulityHight: `${5 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][8])
      return {
        color: '#6FF46F',
        levelQulityTitle: 'Умеренный ветер',
        levelQulitySubtitle:
          'Ветер поднимает пыль и бумажки, качаются тонкие ветви деревьев и без листвы, флюгер крутится беспрерывно. Дым перемешивается в воздухе, теряя форму. Это лучший ветер для работы обычного ветрогенератора (при диаметре ветроколеса 3—6 м).',
        levelQulityHight: `${4 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][9])
      return {
        color: '#96F7B4',
        levelQulityTitle: 'Слабый ветер',
        levelQulitySubtitle:
          'Листья и тонкие ветви деревьев с листвой всё время колышутся, флюгер крутится без частых остановок, ветер развевает лёгкие флаги, дым как бы слизывается с верхушки трубы (при скорости ветра более 4 м/с).',
        levelQulityHight: `${3 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][10])
      return {
        color: '#96F7DC',
        levelQulityTitle: 'Лёгкий ветер',
        levelQulitySubtitle: 'Движение ветра ощущается лицом, шелестят листья, приводится в движение флюгер.',
        levelQulityHight: `${2 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][11])
      return {
        color: 'rgb(174 241 249)',
        levelQulityTitle: 'Тихий ветер',
        levelQulitySubtitle: 'Направление ветра заметно по относу дыма, но не по флюгеру.',
        levelQulityHight: `${1 * 3.9409 + 23.16}px`,
      };
    else if (data >= type[chartType][12])
      return {
        color: 'rgb(115 240 255)',
        levelQulityTitle: 'Штиль',
        levelQulitySubtitle: 'Безветрие. Дым поднимается вертикально, листья деревьев неподвижны.',
        levelQulityHight: '23.16px',
      };
  };

  // ------------------------------

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
                          <div className="bar-val-section__bar-num-big" title="Скорость ветра">
                            {el?.windspeed} м/с
                          </div>
                          <div className="bar-val-section__bar-num-big-second" title="Порывы ветра">
                            {el?.windgust} м/с
                          </div>
                          <div className="bar-val-section__bar-level-big">
                            <div className="bar-level-big__bar-level" title={el?.levelQulitySubtitle}>
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
                    label: 'Скорость ветра',
                    color: 'url(#myGradient)',
                    showMark: false,
                    area: true,
                    valueFormatter: value => `${value?.toFixed(2)} м/с`,
                  },
                  {
                    dataKey: 'value2',
                    label: 'Порывы ветра',
                    color: 'rgb(119, 183, 247)',
                    showMark: false,
                    // yAxisId: 'rightAxisId',
                    valueFormatter: value => `${value?.toFixed(2)} м/с`,
                  },
                ]}
                slots={{
                  legend: () => null,
                }}
                yAxis={[
                  {
                    valueFormatter: value => `${value} м/с`,
                    label: 'Скорость, м/с',
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
                  <linearGradient id="myGradient" gradientTransform="rotate(90)">
                    <stop offset="5%" stopColor="rgb(86 170 255 / 80%)" />
                    <stop offset="95%" stopColor="rgb(86 170 255 / 5%)" />
                  </linearGradient>
                </defs>
              </LineChart>
            </Box>
          </div>

          <div className="air-quality__legend-container" style={{ width: 290 }}>
            <div className="legend-container__item">
              <span
                className="item__filled"
                style={{
                  background: 'linear-gradient(rgb(86, 170, 255) 0%, rgba(86, 170, 255, 0.2) 100%)',
                }}
              ></span>
              <span className="item__label" title="Скорость ветра<">
                <span>Скорость ветра</span>
              </span>
            </div>
            <div className="legend-container__item">
              <span className="item__filled-line" style={{ background: 'rgb(119, 183, 247)' }}></span>
              <span className="item__label" title="Порывы ветра<">
                <span>Порывы ветра</span>
              </span>
            </div>
          </div>

          <div className="air-quality__summary-section">
            <div className="summary-section__text-block">
              <h5 className="text-block__title">Погодные условия. Ветер:</h5>
              <p className="text-block__text">{weeklyData[choiceOfDay]?.levelQulitySubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
