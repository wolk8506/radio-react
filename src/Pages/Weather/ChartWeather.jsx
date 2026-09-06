import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { barElementClasses } from '@mui/x-charts/BarChart';
import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
// import AirIcon from '@mui/icons-material/Air';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
// import WaterDropIcon from '@mui/icons-material/WaterDrop';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
// import AvTimerIcon from '@mui/icons-material/AvTimer';

export const ChartWeather = ({ value = '0' }) => {
  const data_yesterday = useSelector(weatherSelectors.getWeatherYesterday_Data);
  const data_today = useSelector(weatherSelectors.getWeatherToday_Data);
  const data_tomorrow = useSelector(weatherSelectors.getWeatherTomorrow_Data);
  const [quantity, setQuantity] = useState('°');
  const [labelChart, setLabelChart] = useState('Влажность');
  const [dataChartMin, setDataChartMin] = useState(-30);
  const [dataChartMax, setDataChartMax] = useState(40);
  const [dataChart, setDataChart] = useState([{ t: 14 }, { t: 13 }, { t: 13 }, { t: 14 }, { t: 16 }, { t: 20 }]);

  const [btnActiv, setBtnActiv] = useState('0');
  const btnRadio = e => setBtnActiv(e.currentTarget.value);

  const [btnActivDay, setBtnActivDay] = useState('1');
  const btnRadioDay = e => setBtnActivDay(e.currentTarget.value);

  useEffect(() => {
    let data = data_today;

    if (btnActivDay === '0') data = data_yesterday.days[0];
    if (btnActivDay === '1') data = data_today.days[0];
    if (btnActivDay === '2') data = data_tomorrow.days[0];

    let arr;

    if (btnActiv === '0') {
      arr = data.hours.map((el, i) => {
        return { t: el.temp, time: i === 4 && el.datetime === '03:00:00' ? '03:00.' : el.datetime.slice(0, -3) };
      });

      setQuantity('°');
      setLabelChart('Температура');
    }
    if (btnActiv === '1') {
      arr = data.hours.map((el, i) => {
        return { t: el.humidity, time: i === 4 && el.datetime === '03:00:00' ? '03:00.' : el.datetime.slice(0, -3) };
      });

      setQuantity('%');
      setLabelChart('Влажность');
    }
    if (btnActiv === '2') {
      arr = data.hours.map((el, i) => {
        return { t: el.windspeed, time: i === 4 && el.datetime === '03:00:00' ? '03:00.' : el.datetime.slice(0, -3) };
      });

      setQuantity('м/с');
      setLabelChart('Скорость ветра');
    }
    if (btnActiv === '3') {
      arr = data.hours.map((el, i) => {
        return { t: el.precip, time: i === 4 && el.datetime === '03:00:00' ? '03:00.' : el.datetime.slice(0, -3) };
      });

      setQuantity('мм');
      setLabelChart('Осадки');
    }
    if (btnActiv === '4') {
      arr = data.hours.map((el, i) => {
        return { t: el.cloudcover, time: i === 4 && el.datetime === '03:00:00' ? '03:00.' : el.datetime.slice(0, -3) };
      });

      setQuantity('%');
      setLabelChart('Облачность');
    }
    if (btnActiv === '5') {
      arr = data.hours.map((el, i) => {
        return { t: el.pressure, time: i === 4 && el.datetime === '03:00:00' ? '03:00.' : el.datetime.slice(0, -3) };
      });

      setQuantity('мм');
      setLabelChart('Давление');
    }
    setDataChart(arr);
    setDataChartMin(Math.floor(Math.min(...arr.map(i => i.t))));
    setDataChartMax(Math.ceil(Math.max(...arr.map(i => i.t))));
  }, [btnActiv, btnActivDay, data_today, data_tomorrow, data_yesterday, value]);

  return (
    <Stack className="chart" sx={{ width: '100%' }}>
      <div className="chart__header">
        <ButtonGroup className="chart__buttons" variant="outlined" aria-label="Basic button group">
          <Button
            className={`header__btn ${btnActivDay === '0' && 'header__btn--activ'}`}
            value="0"
            onClick={btnRadioDay}
          >
            Вчера
          </Button>
          <Button
            className={`header__btn ${btnActivDay === '1' && 'header__btn--activ'}`}
            value="1"
            onClick={btnRadioDay}
          >
            Сегодня
          </Button>
          <Button
            className={`header__btn ${btnActivDay === '2' && 'header__btn--activ'}`}
            value="2"
            onClick={btnRadioDay}
          >
            Завтра
          </Button>
        </ButtonGroup>
        <ButtonGroup className="chart__buttons" variant="outlined" aria-label="Basic button group">
          <Button value="0" onClick={btnRadio}>
            <DeviceThermostatIcon className={`header__btn ${btnActiv === '0' && 'header__btn--activ'}`} />
          </Button>
          {/* <Button value="1" onClick={btnRadio}>
            <WaterDropIcon className={`header__btn ${btnActiv === '1' && 'header__btn--activ'}`} />
          </Button> */}
          {/* <Button value="2" onClick={btnRadio}>
            <AirIcon className={`header__btn ${btnActiv === '2' && 'header__btn--activ'}`} />
          </Button> */}
          <Button value="3" onClick={btnRadio}>
            <ThunderstormIcon className={`header__btn ${btnActiv === '3' && 'header__btn--activ'}`} />
          </Button>
          <Button value="4" onClick={btnRadio}>
            <FilterDramaIcon className={`header__btn ${btnActiv === '4' && 'header__btn--activ'}`} />
          </Button>
          {/* <Button value="5" onClick={btnRadio}>
            <AvTimerIcon className={`header__btn ${btnActiv === '5' && 'header__btn--activ'}`} />
          </Button> */}
        </ButtonGroup>
        <h4 className="chart-title" variant="body1">
          {labelChart}, {quantity}
        </h4>
      </div>

      <LineChart
        sx={theme => ({
          [`.${barElementClasses.root}`]: {
            fill: theme.palette.background.paper,
            strokeWidth: 3,
          },
          [`.${axisClasses.root}`]: {
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
              stroke: '#fce3af',
              strokeWidth: 1,
            },
            [`.${axisClasses.tickLabel}`]: {
              fill: '#e19646',
            },
          },
          backgroundPosition: '20px 20px, 20px 20px',
          ...theme.applyStyles('dark', {
            backgroundImage:
              'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
          }),
        })}
        xAxis={[{ data: dataChart.map(i => i.time), scaleType: 'point' }]}
        dataset={dataChart}
        series={[
          {
            label: labelChart,
            showMark: false,
            dataKey: 't',
            valueFormatter: value => `${value?.toFixed(2)}${quantity}`,
          },
        ]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            valueFormatter: value => `${value}${quantity}`,
            area: true,
            colorMap: {
              type: 'continuous',
              min: dataChartMin,
              max: dataChartMax,
              color: ['blue', 'red'],
            },
          },
        ]}
        grid={{ horizontal: true }}
        height={250}
        margin={{ top: 10, bottom: 20 }}
        slots={{ legend: ContinuousColorLegend }}
        slotProps={{
          legend: {
            axisDirection: 'y',
            direction: 'vertical',
            thickness: 16,
            labelPosition: 'extremes',
            reverse: false,
            sx: { height: '150px', color: 'var(--color-03)' },
          },
        }}
      ></LineChart>
    </Stack>
  );
};
