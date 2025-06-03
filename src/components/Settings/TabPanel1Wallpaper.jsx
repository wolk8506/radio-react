import * as React from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const imageNames = [4, 6, 7, 10, 11, 12, 13, 14, 15, 16];

const images = imageNames.map(num => ({
  preview: require(`../../images/wallpaper/different/img_${num}_128.webp`),
  wallpaper: require(`../../images/wallpaper/different/img_${num}.jpg`),
}));

export const TabPanel1Wallpaper = ({ value, onHandleChange }) => {
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
