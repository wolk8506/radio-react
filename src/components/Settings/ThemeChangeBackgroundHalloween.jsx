import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeChengeWalpaper } from 'store/root/actions';
import { getThemeChengeWalpaper } from 'store/root/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import holiday_1_128 from '../../images/wallpaper/holiday/img_1_128.webp';
import holiday_2_128 from '../../images/wallpaper/holiday/img_2_128.webp';
import holiday_3_128 from '../../images/wallpaper/holiday/img_3_128.webp';
import holiday_4_128 from '../../images/wallpaper/holiday/img_4_128.webp';
import holiday_5_128 from '../../images/wallpaper/holiday/img_5_128.webp';
import holiday_6_128 from '../../images/wallpaper/holiday/img_6_128.webp';
import holiday_7_128 from '../../images/wallpaper/holiday/img_7_128.webp';
import holiday_8_128 from '../../images/wallpaper/holiday/img_8_128.webp';
import holiday_9_128 from '../../images/wallpaper/holiday/img_9_128.webp';

import holiday_1 from '../../images/wallpaper/holiday/img_1.jpg';
import holiday_2 from '../../images/wallpaper/holiday/img_2.jpg';
import holiday_3 from '../../images/wallpaper/holiday/img_3.jpg';
import holiday_4 from '../../images/wallpaper/holiday/img_4.jpg';
import holiday_5 from '../../images/wallpaper/holiday/img_5.jpg';
import holiday_6 from '../../images/wallpaper/holiday/img_6.jpg';
import holiday_7 from '../../images/wallpaper/holiday/img_7.jpg';
import holiday_8 from '../../images/wallpaper/holiday/img_8.jpg';
import holiday_9 from '../../images/wallpaper/holiday/img_9.jpg';

export const ThemeChangeBackgroundHalloween = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(getThemeChengeWalpaper);
  const name_holiday = 'Хэллоуин';

  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleChange = e => {
    dispatch(setThemeChengeWalpaper(e.target.value));
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
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_1})`}
                control={<Radio />}
                label={`${name_holiday} 1`}
              />
              <img className="item-background__img" src={holiday_1_128} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_2})`}
                control={<Radio />}
                label={`${name_holiday} 2`}
              />
              <img src={holiday_2_128} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_3})`}
                control={<Radio />}
                label={`${name_holiday} 3`}
              />
              <img src={holiday_3_128} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_4})`}
                control={<Radio />}
                label={`${name_holiday} 4`}
              />
              <img src={holiday_4_128} alt="" width={64} />
            </div>

            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_5})`}
                control={<Radio />}
                label={`${name_holiday} 5`}
              />
              <img src={holiday_5_128} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_6})`}
                control={<Radio />}
                label={`${name_holiday} 6`}
              />
              <img src={holiday_6_128} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_7})`}
                control={<Radio />}
                label={`${name_holiday} 7`}
              />
              <img src={holiday_7_128} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_8})`}
                control={<Radio />}
                label={`${name_holiday} 8`}
              />
              <img src={holiday_8_128} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value={`url(${holiday_9})`}
                control={<Radio />}
                label={`${name_holiday} 9`}
              />
              <img src={holiday_9_128} alt="" width={64} />
            </div>
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
