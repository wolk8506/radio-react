import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const imageNames = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const getImg = data => {
  return data.map(num => ({
    preview: require(`../../images/wallpaper/holiday/img_${num}_128.webp`),
    wallpaper: require(`../../images/wallpaper/holiday/img_${num}.jpg`),
  }));
};
const images = getImg(imageNames);

export const TabPanel3WallpaperHalloween = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(rootSelectors.getThemeChengeWalpaper);
  const name_holiday = 'Хэллоуин';

  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleChange = e => {
    dispatch(dataActions.setThemeChengeWalpaper(e.target.value));
    setValue(e.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="controlled-radio-theme-background">Изменение фона</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-theme-background"
        name="radio-theme-background"
        value={value}
        onChange={handleChange}
      >
        <div className="wallpaper-collection">
          <div className="wallpaper-collection__item">
            <p>{name_holiday}</p>
            {images.map((i, index) => {
              return (
                <div className="item-background" key={index}>
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
  );
};
