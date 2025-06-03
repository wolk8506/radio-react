import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import moment from 'moment';

const color_1 = 'pribor-color-1';
const color_2 = 'pribor-color-2';

export function Clouds() {
  return React.createElement(
    'div',
    {
      className: 'max-w-7xl mx-auto flex flex-wrap items-center justify-center',
    },
    React.createElement(DemoF, null)
  );
}

function Card({ title, children }) {
  return React.createElement(
    'div',
    { className: 'p-2' },
    React.createElement(
      'div',
      {
        className: 'p-4  bg-white shadow-md rounded-md inline-block',
      },
      React.createElement('div', { className: 'px-3 font-bold text-xl pb-4' }, title),
      children
    )
  );
}

function deriveData(index, value) {
  const r1 = 130;

  const r2 = 150;
  const r3 = 140;
  const delta = Math.PI / 40;
  const angle = delta * index - Math.PI;

  const ss = Math.sin(angle);
  const cc = Math.cos(angle);

  const rs = index % 5 === 0 ? r1 : r3;

  const x1 = rs * cc;
  const y1 = rs * ss;
  const x2 = r2 * cc;
  const y2 = r2 * ss;

  const color = Math.ceil(value * (41 / 100)) > index ? color_1 : color_2;
  return { x1, y1, x2, y2, color };
}

function Tick({ index, value }) {
  const { x1, y1, x2, y2, color } = deriveData(index, value);
  return React.createElement('line', {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    // stroke: color,
    className: color,
    strokeWidth: '3',
    strokeLinecap: 'round',
  });
}

function DemoF() {
  const data_today = useSelector(weatherSelectors.getWeatherToday_Data);
  const [value, setCloud] = useState(0);
  useEffect(() => {
    const hour = moment().format('H');

    setCloud(data_today.days[0].hours[hour].cloudcover); // Облачность
  }, [data_today]);

  return React.createElement(
    Card,
    { title: 'Облачность' },
    React.createElement(
      'div',
      { style: { padding: '0px 12px' } },
      React.createElement(
        'div',
        { className: 'relative', style: { width: '300px' } },
        React.createElement(
          'svg',
          {
            width: '120',
            height: '60',
            viewBox: '0 0 300 180',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
          },

          React.createElement('path', {
            fillRule: 'evenodd',
            clipRule: 'evenodd',
            d: 'M152.991 34.67C152.706 30.9785 147.294 30.9785 147.009 34.67L138.696 142.139C136.395 144.776 135 148.225 135 152C135 160.284 141.716 167 150 167C158.284 167 165 160.284 165 152C165 148.225 163.606 144.776 161.304 142.139L152.991 34.67Z',
            fill: '#ffffff',
            transform: `rotate(${-90 + 1.8 * value}, 150, 152)`,
          }),

          React.createElement(
            'g',
            { transform: 'translate(150, 152)' },
            React.createElement('circle', { r: '8', fill: '#e19646' }),
            Array(41)
              .fill(0)
              .map((_, i) => React.createElement(Tick, { key: i, index: i, value: value }))
          )
        )
      )
    ),

    React.createElement(
      'div',
      {
        className: 'flex items-center justify-between px-3 font-semibold h-8',
      },
      React.createElement('div', null, ' ', `${value}%`, ' ')
    )
  );
}
