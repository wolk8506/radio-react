import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { barElementClasses } from '@mui/x-charts/BarChart';
import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import AirIcon from '@mui/icons-material/Air';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import AvTimerIcon from '@mui/icons-material/AvTimer';

export const ChartWeather = ({ value = '0' }) => {
  const data_yesterday = useSelector(state => state.storeWeatherLastDay.yesterday.days[0]);
  const data_today = useSelector(state => state.storeWeatherLastDay.today.days[0]);
  const data_tomorrow = useSelector(state => state.storeWeatherLastDay.tomorrow.days[0]);
  const [quantity, setQuantity] = useState('°');
  const [labelChart, setLabelChart] = useState('Влажность');
  const [dataChartMin, setDataChartMin] = useState(-30);
  const [dataChartMax, setDataChartMax] = useState(40);
  const [dataChart, setDataChart] = useState([{ t: 14 }, { t: 13 }, { t: 13 }, { t: 14 }, { t: 16 }, { t: 20 }]);

  const xData = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];
  const [btnActiv, setBtnActiv] = useState('0');
  const btnRadio = e => setBtnActiv(e.currentTarget.value);

  const [btnActivDay, setBtnActivDay] = useState('1');
  const btnRadioDay = e => setBtnActivDay(e.currentTarget.value);

  useEffect(() => {
    let data = data_today;

    if (btnActivDay === '0') data = data_yesterday;
    if (btnActivDay === '1') data = data_today;
    if (btnActivDay === '2') data = data_tomorrow;

    let arr;

    if (btnActiv === '0') {
      arr = data.hours.map(i => {
        return { t: i.temp };
      });
      setQuantity('°');
      setLabelChart('Температура');
    }
    if (btnActiv === '1') {
      arr = data.hours.map(i => {
        return { t: i.humidity };
      });
      setQuantity('%');
      setLabelChart('Влажность');
    }
    if (btnActiv === '2') {
      arr = data.hours.map(i => {
        return { t: Number((i.windspeed / 3.6).toFixed(1)), label: 'Ветер' };
      });

      setQuantity('м/с');
      setLabelChart('Скорость ветра');
    }
    if (btnActiv === '3') {
      arr = data.hours.map(i => {
        return { t: i.precip };
      });
      setQuantity('мм');
      setLabelChart('Осадки');
    }
    if (btnActiv === '4') {
      arr = data.hours.map(i => {
        return { t: i.cloudcover };
      });
      setQuantity('%');
      setLabelChart('Облачность');
    }
    if (btnActiv === '5') {
      arr = data.hours.map(i => {
        return { t: Number((i.pressure * 0.75).toFixed(0)) };
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
          <Button value="1" onClick={btnRadio}>
            <WaterDropIcon className={`header__btn ${btnActiv === '1' && 'header__btn--activ'}`} />
          </Button>
          <Button value="2" onClick={btnRadio}>
            <AirIcon className={`header__btn ${btnActiv === '2' && 'header__btn--activ'}`} />
          </Button>
          <Button value="3" onClick={btnRadio}>
            <ThunderstormIcon className={`header__btn ${btnActiv === '3' && 'header__btn--activ'}`} />
          </Button>
          <Button value="4" onClick={btnRadio}>
            <FilterDramaIcon className={`header__btn ${btnActiv === '4' && 'header__btn--activ'}`} />
          </Button>
          <Button value="5" onClick={btnRadio}>
            <AvTimerIcon className={`header__btn ${btnActiv === '5' && 'header__btn--activ'}`} />
          </Button>
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
        xAxis={[{ data: xData, scaleType: 'point' }]}
        dataset={dataChart}
        slotProps={{ legend: { hidden: true } }}
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
      >
        <ContinuousColorLegend
          axisDirection="y"
          position={{ vertical: 'middle', horizontal: 'right' }} //middle//right
          direction="column" //column//row
          length="50%"
          thickness={5}
          align="middle"
          labelStyle={{ fontSize: 16 }}
        />
      </LineChart>
    </Stack>
  );
};
