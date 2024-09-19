import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { barElementClasses } from '@mui/x-charts/BarChart';
import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import Stack from '@mui/material/Stack';

const colors = ['#e19646', '#e19646'];

export const ChartWeather = ({ value = '0' }) => {
  const data15 = useSelector(state => state.storeWeather15);
  const [quantity, setQuantity] = useState('°');
  const [labelChart, setLabelChart] = useState('Влажность');
  const [dataChartMin, setDataChartMin] = useState(-30);
  const [dataChartMax, setDataChartMax] = useState(40);
  const [dataChart, setDataChart] = useState([
    { t: 14 },
    { t: 13 },
    { t: 13 },
    { t: 14 },
    { t: 16 },
    { t: 20 },
  ]);

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

  useEffect(() => {
    let arr;
    if (value === '0') {
      arr = data15.days[0].hours.map(i => {
        return { t: i.temp };
      });
      setQuantity('°');
      setLabelChart('Температура');
    }
    if (value === '1') {
      arr = data15.days[0].hours.map(i => {
        return { t: i.humidity };
      });
      setQuantity('%');
      setLabelChart('Влажность');
    }
    if (value === '2') {
      arr = data15.days[0].hours.map(i => {
        return { t: Number((i.windspeed / 3.6).toFixed(1)), label: 'Ветер' };
      });
      console.log(arr);
      setQuantity('м/с');
      setLabelChart('Скорость ветра');
    }

    setDataChart(arr);
    setDataChartMin(Math.floor(Math.min(...arr.map(i => i.t))));
    setDataChartMax(Math.ceil(Math.max(...arr.map(i => i.t))));
  }, [data15, value]);

  return (
    <Stack className="chart" sx={{ width: '100%' }}>
      <h4 className="chart-title" variant="body1">
        {labelChart}, {quantity}
      </h4>
      <LineChart
        sx={theme => ({
          [`.${barElementClasses.root}`]: {
            fill: theme.palette.background.paper,
            strokeWidth: 3,
          },
          [`.MuiBarElement-series-l_id`]: {
            stroke: colors[0],
          },
          [`.MuiBarElement-series-r_id`]: {
            stroke: colors[1],
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
          // border: '1px solid rgba(0, 0, 0, 0.1)',
          // backgroundImage:
          //   'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
          // backgroundSize: '35px 35px',
          backgroundPosition: '20px 20px, 20px 20px',
          ...theme.applyStyles('dark', {
            // borderColor: 'rgba(255,255,255, 0.1)',
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
          position={{ vertical: 'middle', horizontal: 'right' }}
          direction="column"
          length="50%"
          thickness={5}
          align="middle"
          labelStyle={{ fontSize: 16 }}
        />
      </LineChart>
    </Stack>
  );
};
