import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const imageNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14, 15];
const imageNames2 = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

const getImg = data => {
  return data.map(num => ({
    preview: require(`../../images/wallpaper/holiday/new-year-${num}_128.jpg`),
    wallpaper: require(`../../images/wallpaper/holiday/new-year-${num}.jpg`),
  }));
};
const images = getImg(imageNames);
const images2 = getImg(imageNames2);

export const TabPanel2WallpaperNewYear = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(rootSelectors.getThemeChengeWalpaper);
  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleChange = e => {
    dispatch(dataActions.setThemeChengeWalpaper(e.target.value));
    setValue(e.target.value);
  };

  return (
    <>
      <div className="settings">
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
                <p>Новый год</p>
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
      </div>
      <div className="settings">
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
                <p>Новый год</p>
                {images2.map((i, index) => {
                  return (
                    <div className="item-background" key={index}>
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
      </div>
    </>
  );
};
