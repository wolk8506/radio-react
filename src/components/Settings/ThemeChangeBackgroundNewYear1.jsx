import * as React from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import img_01_128 from '../../images/wallpaper/holiday/new-year-01_128.jpg';
import img_02_128 from '../../images/wallpaper/holiday/new-year-02_128.jpg';
import img_03_128 from '../../images/wallpaper/holiday/new-year-03_128.jpg';
import img_04_128 from '../../images/wallpaper/holiday/new-year-04_128.jpg';
import img_05_128 from '../../images/wallpaper/holiday/new-year-05_128.jpg';
import img_06_128 from '../../images/wallpaper/holiday/new-year-06_128.jpg';
import img_07_128 from '../../images/wallpaper/holiday/new-year-07_128.jpg';
import img_08_128 from '../../images/wallpaper/holiday/new-year-08_128.jpg';
import img_09_128 from '../../images/wallpaper/holiday/new-year-09_128.jpg';
import img_10_128 from '../../images/wallpaper/holiday/new-year-10_128.jpg';
import img_11_128 from '../../images/wallpaper/holiday/new-year-11_128.jpg';
import img_12_128 from '../../images/wallpaper/holiday/new-year-12_128.jpg';
import img_13_128 from '../../images/wallpaper/holiday/new-year-13_128.jpg';
import img_14_128 from '../../images/wallpaper/holiday/new-year-14_128.jpg';
import img_15_128 from '../../images/wallpaper/holiday/new-year-15_128.jpg';

import img_01 from '../../images/wallpaper/holiday/new-year-01.jpg';
import img_02 from '../../images/wallpaper/holiday/new-year-02.jpg';
import img_03 from '../../images/wallpaper/holiday/new-year-03.jpg';
import img_04 from '../../images/wallpaper/holiday/new-year-04.jpg';
import img_05 from '../../images/wallpaper/holiday/new-year-05.jpg';
import img_06 from '../../images/wallpaper/holiday/new-year-06.jpg';
import img_07 from '../../images/wallpaper/holiday/new-year-07.jpg';
import img_08 from '../../images/wallpaper/holiday/new-year-08.jpg';
import img_09 from '../../images/wallpaper/holiday/new-year-09.jpg';
import img_10 from '../../images/wallpaper/holiday/new-year-10.jpg';
import img_11 from '../../images/wallpaper/holiday/new-year-11.jpg';
import img_12 from '../../images/wallpaper/holiday/new-year-12.jpg';
import img_13 from '../../images/wallpaper/holiday/new-year-13.jpg';
import img_14 from '../../images/wallpaper/holiday/new-year-14.jpg';
import img_15 from '../../images/wallpaper/holiday/new-year-15.jpg';

const images = [
  { preview: img_01_128, wallpaper: img_01 },
  { preview: img_02_128, wallpaper: img_02 },
  { preview: img_03_128, wallpaper: img_03 },
  { preview: img_04_128, wallpaper: img_04 },
  { preview: img_05_128, wallpaper: img_05 },
  { preview: img_06_128, wallpaper: img_06 },
  { preview: img_07_128, wallpaper: img_07 },
  { preview: img_08_128, wallpaper: img_08 },
  { preview: img_09_128, wallpaper: img_09 },
  { preview: img_10_128, wallpaper: img_10 },
  { preview: img_11_128, wallpaper: img_11 },
  { preview: img_12_128, wallpaper: img_12 },
  { preview: img_13_128, wallpaper: img_13 },
  { preview: img_14_128, wallpaper: img_14 },
  { preview: img_15_128, wallpaper: img_15 },
];

export const ThemeChangeBackgroundNewYear1 = ({ value, onHandleChange }) => {
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
                      label={`Новый год ${index + 1}`}
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
