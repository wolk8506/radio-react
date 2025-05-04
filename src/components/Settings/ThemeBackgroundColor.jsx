import * as React from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const color = [
  { name: 'Базовый оттенок', color: 'linear-gradient(90deg, var(--color-06), var(--color-06))' },
  { name: 'Глубокий шоколад', color: 'linear-gradient(90deg, rgb(39, 33, 33), rgb(39, 33, 33))' },
  { name: 'Темный графит', color: 'linear-gradient(90deg, rgb(33, 37, 39), rgb(33, 37, 39))' },
  { name: 'Пыльное золото', color: 'linear-gradient(90deg, rgb(196, 159, 104), rgb(196, 159, 104))' },
  { name: 'Кремовый айвори', color: 'linear-gradient(90deg, rgb(236 234 228), rgb(236 234 228))' },
  {
    name: 'Золотая заря',
    color:
      'radial-gradient(ellipse farthest-corner at right bottom, rgb(254, 219, 55) 0%, rgb(253, 185, 49) 8%, rgb(159, 121, 40) 30%, rgb(138, 110, 47) 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, rgb(255, 255, 255) 0%, rgb(255, 255, 172) 8%, rgb(209, 180, 100) 25%, rgb(93, 74, 31) 62.5%, rgb(93, 74, 31) 100%)',
  },
  { name: 'Мистический сумрак', color: 'linear-gradient(90deg, rgb(62, 77, 74), rgb(126, 72, 161))' },
  {
    name: 'Глубины ночи',
    color: 'linear-gradient(90deg, rgb(72, 92, 100), rgb(68, 76, 84), rgb(52, 60, 60), rgb(24, 36, 44))',
  },
  { name: 'Космическая тьма', color: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' },
];

export const ThemeBackgroundColor = ({ value, onHandleChange }) => {
  return (
    <FormControl>
      <FormLabel id="controlled-radio-theme-background">Изменение фона</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-theme-background"
        name="radio-theme-background"
        value={value}
        onChange={onHandleChange}
      >
        <div className="wallpaper-collection">
          <div className="wallpaper-collection__item">
            <p>Цвета</p>

            {color.map((i, index) => {
              return (
                <div className="item-background" key={index}>
                  <FormControlLabel className="btn" value={i.color} control={<Radio />} label={i.name} />
                  <div className="item-background-color"></div>
                </div>
              );
            })}
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
