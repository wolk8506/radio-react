import * as React from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import img_16_128 from '../../images/wallpaper/holiday/new-year-16_128.jpg';
import img_17_128 from '../../images/wallpaper/holiday/new-year-17_128.jpg';
import img_18_128 from '../../images/wallpaper/holiday/new-year-18_128.jpg';
import img_19_128 from '../../images/wallpaper/holiday/new-year-19_128.jpg';
import img_20_128 from '../../images/wallpaper/holiday/new-year-20_128.jpg';
import img_21_128 from '../../images/wallpaper/holiday/new-year-21_128.jpg';
import img_22_128 from '../../images/wallpaper/holiday/new-year-22_128.jpg';
import img_23_128 from '../../images/wallpaper/holiday/new-year-23_128.jpg';
import img_24_128 from '../../images/wallpaper/holiday/new-year-24_128.jpg';
import img_25_128 from '../../images/wallpaper/holiday/new-year-25_128.jpg';
import img_26_128 from '../../images/wallpaper/holiday/new-year-26_128.jpg';
import img_27_128 from '../../images/wallpaper/holiday/new-year-27_128.jpg';
import img_28_128 from '../../images/wallpaper/holiday/new-year-28_128.jpg';
import img_29_128 from '../../images/wallpaper/holiday/new-year-29_128.jpg';

import img_16 from '../../images/wallpaper/holiday/new-year-16.jpg';
import img_17 from '../../images/wallpaper/holiday/new-year-17.jpg';
import img_18 from '../../images/wallpaper/holiday/new-year-18.jpg';
import img_19 from '../../images/wallpaper/holiday/new-year-19.jpg';
import img_20 from '../../images/wallpaper/holiday/new-year-20.jpg';
import img_21 from '../../images/wallpaper/holiday/new-year-21.jpg';
import img_22 from '../../images/wallpaper/holiday/new-year-22.jpg';
import img_23 from '../../images/wallpaper/holiday/new-year-23.jpg';
import img_24 from '../../images/wallpaper/holiday/new-year-24.jpg';
import img_25 from '../../images/wallpaper/holiday/new-year-25.jpg';
import img_26 from '../../images/wallpaper/holiday/new-year-26.jpg';
import img_27 from '../../images/wallpaper/holiday/new-year-27.jpg';
import img_28 from '../../images/wallpaper/holiday/new-year-28.jpg';
import img_29 from '../../images/wallpaper/holiday/new-year-29.jpg';

const images = [
  { preview: img_16_128, wallpaper: img_16 },
  { preview: img_17_128, wallpaper: img_17 },
  { preview: img_18_128, wallpaper: img_18 },
  { preview: img_19_128, wallpaper: img_19 },
  { preview: img_20_128, wallpaper: img_20 },
  { preview: img_21_128, wallpaper: img_21 },
  { preview: img_22_128, wallpaper: img_22 },
  { preview: img_23_128, wallpaper: img_23 },
  { preview: img_24_128, wallpaper: img_24 },
  { preview: img_25_128, wallpaper: img_25 },
  { preview: img_26_128, wallpaper: img_26 },
  { preview: img_27_128, wallpaper: img_27 },
  { preview: img_28_128, wallpaper: img_28 },
  { preview: img_29_128, wallpaper: img_29 },
];

export const ThemeChangeBackgroundNewYear2 = ({ value, onHandleChange }) => {
  return (
    <>
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
              <p>Новый год</p>
              {images.map((i, index) => {
                return (
                  <div className="item-background">
                    <FormControlLabel
                      className="btn"
                      value={`url(${i.wallpaper})`}
                      control={<Radio />}
                      label={`Новый год ${index + 16}`}
                    />
                    <img className="item-background__img" src={i.preview} alt="" width={64} />
                  </div>
                );
              })}
            </div>
          </div>
        </RadioGroup>
      </FormControl>
    </>
  );
};
