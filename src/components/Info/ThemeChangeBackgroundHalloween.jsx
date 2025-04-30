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

import holiday_1 from '../../images/wallpaper/holiday/img_1_128.webp';
import holiday_2 from '../../images/wallpaper/holiday/img_2_128.webp';
import holiday_3 from '../../images/wallpaper/holiday/img_3_128.webp';
import holiday_4 from '../../images/wallpaper/holiday/img_4_128.webp';
import holiday_5 from '../../images/wallpaper/holiday/img_5_128.webp';
import holiday_6 from '../../images/wallpaper/holiday/img_6_128.webp';
import holiday_7 from '../../images/wallpaper/holiday/img_7_128.webp';
import holiday_8 from '../../images/wallpaper/holiday/img_8_128.webp';
import holiday_9 from '../../images/wallpaper/holiday/img_9_128.webp';

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
              <FormControlLabel className="btn" value="holiday-1" control={<Radio />} label={`${name_holiday} 1`} />
              <img src={holiday_1} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-2" control={<Radio />} label={`${name_holiday} 2`} />
              <img src={holiday_2} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-3" control={<Radio />} label={`${name_holiday} 3`} />
              <img src={holiday_3} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-4" control={<Radio />} label={`${name_holiday} 4`} />
              <img src={holiday_4} alt="" width={64} />
            </div>

            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-5" control={<Radio />} label={`${name_holiday} 5`} />
              <img src={holiday_5} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-6" control={<Radio />} label={`${name_holiday} 6`} />
              <img src={holiday_6} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-7" control={<Radio />} label={`${name_holiday} 7`} />
              <img src={holiday_7} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-8" control={<Radio />} label={`${name_holiday} 8`} />
              <img src={holiday_8} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="holiday-9" control={<Radio />} label={`${name_holiday} 9`} />
              <img src={holiday_9} alt="" width={64} />
            </div>
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
