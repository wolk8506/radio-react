import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import img_4_128 from '../../images/wallpaper/different/img_4_128.webp';
import img_6_128 from '../../images/wallpaper/different/img_6_128.webp';
import img_7_128 from '../../images/wallpaper/different/img_7_128.webp';
import img_10_128 from '../../images/wallpaper/different/img_10_128.webp';
import img_11_128 from '../../images/wallpaper/different/img_11_128.webp';
import img_12_128 from '../../images/wallpaper/different/img_12_128.webp';
import img_13_128 from '../../images/wallpaper/different/img_13_128.webp';
import img_14_128 from '../../images/wallpaper/different/img_14_128.webp';
import img_15_128 from '../../images/wallpaper/different/img_15_128.webp';
import img_16_128 from '../../images/wallpaper/different/img_16_128.webp';

import img_4 from '../../images/wallpaper/different/img_4.jpg';
import img_6 from '../../images/wallpaper/different/img_6.jpg';
import img_7 from '../../images/wallpaper/different/img_7.jpg';
import img_10 from '../../images/wallpaper/different/img_10.jpg';
import img_11 from '../../images/wallpaper/different/img_11.jpg';
import img_12 from '../../images/wallpaper/different/img_12.jpg';
import img_13 from '../../images/wallpaper/different/img_13.jpg';
import img_14 from '../../images/wallpaper/different/img_14.jpg';
import img_15 from '../../images/wallpaper/different/img_15.jpg';
import img_16 from '../../images/wallpaper/different/img_16.jpg';

const images = [
  { preview: img_4_128, wallpaper: img_4 },
  { preview: img_6_128, wallpaper: img_6 },
  { preview: img_7_128, wallpaper: img_7 },
  { preview: img_10_128, wallpaper: img_10 },
  { preview: img_11_128, wallpaper: img_11 },
  { preview: img_12_128, wallpaper: img_12 },
  { preview: img_13_128, wallpaper: img_13 },
  { preview: img_14_128, wallpaper: img_14 },
  { preview: img_15_128, wallpaper: img_15 },
  { preview: img_16_128, wallpaper: img_16 },
];

export const ThemeBackgroundImg = ({ value, onHandleChange }) => {
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
            <p>Разное</p>

            {images.map((i, index) => {
              return (
                <div className="item-background" key={index}>
                  <FormControlLabel
                    className="btn"
                    value={`url(${i.wallpaper})`}
                    control={<Radio />}
                    label={`Изображение ${index + 1}`}
                  />
                  <img className="item-background__img" src={i.preview} alt="" width={64} />
                </div>
              );
            })}
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
