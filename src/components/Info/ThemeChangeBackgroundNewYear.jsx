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

import new_year_01 from '../../images/wallpaper/holiday/new-year-01_128.jpg';
import new_year_02 from '../../images/wallpaper/holiday/new-year-02_128.jpg';
import new_year_03 from '../../images/wallpaper/holiday/new-year-03_128.jpg';
import new_year_04 from '../../images/wallpaper/holiday/new-year-04_128.jpg';
import new_year_05 from '../../images/wallpaper/holiday/new-year-05_128.jpg';
import new_year_06 from '../../images/wallpaper/holiday/new-year-06_128.jpg';
import new_year_07 from '../../images/wallpaper/holiday/new-year-07_128.jpg';
import new_year_08 from '../../images/wallpaper/holiday/new-year-08_128.jpg';
import new_year_09 from '../../images/wallpaper/holiday/new-year-09_128.jpg';
import new_year_10 from '../../images/wallpaper/holiday/new-year-10_128.jpg';
import new_year_11 from '../../images/wallpaper/holiday/new-year-11_128.jpg';
import new_year_12 from '../../images/wallpaper/holiday/new-year-12_128.jpg';
import new_year_13 from '../../images/wallpaper/holiday/new-year-13_128.jpg';
import new_year_14 from '../../images/wallpaper/holiday/new-year-14_128.jpg';
import new_year_15 from '../../images/wallpaper/holiday/new-year-15_128.jpg';
import new_year_16 from '../../images/wallpaper/holiday/new-year-16_128.jpg';
import new_year_17 from '../../images/wallpaper/holiday/new-year-17_128.jpg';
import new_year_18 from '../../images/wallpaper/holiday/new-year-18_128.jpg';
import new_year_19 from '../../images/wallpaper/holiday/new-year-19_128.jpg';
import new_year_20 from '../../images/wallpaper/holiday/new-year-20_128.jpg';
import new_year_21 from '../../images/wallpaper/holiday/new-year-21_128.jpg';
import new_year_22 from '../../images/wallpaper/holiday/new-year-22_128.jpg';
import new_year_23 from '../../images/wallpaper/holiday/new-year-23_128.jpg';
import new_year_24 from '../../images/wallpaper/holiday/new-year-24_128.jpg';
import new_year_25 from '../../images/wallpaper/holiday/new-year-25_128.jpg';
import new_year_26 from '../../images/wallpaper/holiday/new-year-26_128.jpg';
import new_year_27 from '../../images/wallpaper/holiday/new-year-27_128.jpg';
import new_year_28 from '../../images/wallpaper/holiday/new-year-28_128.jpg';
import new_year_29 from '../../images/wallpaper/holiday/new-year-29_128.jpg';

export const ThemeChangeBackgroundNewYear = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(getThemeChengeWalpaper);
  const name_holiday_2 = 'Новый год';

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
            <p>{name_holiday_2}</p>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-01" control={<Radio />} label={`${name_holiday_2} 1`} />
              <img src={new_year_01} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-02" control={<Radio />} label={`${name_holiday_2} 2`} />
              <img src={new_year_02} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-03" control={<Radio />} label={`${name_holiday_2} 3`} />
              <img src={new_year_03} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-04" control={<Radio />} label={`${name_holiday_2} 4`} />
              <img src={new_year_04} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-05" control={<Radio />} label={`${name_holiday_2} 5`} />
              <img src={new_year_05} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-06" control={<Radio />} label={`${name_holiday_2} 6`} />
              <img src={new_year_06} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-07" control={<Radio />} label={`${name_holiday_2} 7`} />
              <img src={new_year_07} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-08" control={<Radio />} label={`${name_holiday_2} 8`} />
              <img src={new_year_08} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="new-year-09" control={<Radio />} label={`${name_holiday_2} 9`} />
              <img src={new_year_09} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-10"
                control={<Radio />}
                label={`${name_holiday_2} 10`}
              />
              <img src={new_year_10} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-11"
                control={<Radio />}
                label={`${name_holiday_2} 11`}
              />
              <img src={new_year_11} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-12"
                control={<Radio />}
                label={`${name_holiday_2} 12`}
              />
              <img src={new_year_12} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-13"
                control={<Radio />}
                label={`${name_holiday_2} 13`}
              />
              <img src={new_year_13} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-14"
                control={<Radio />}
                label={`${name_holiday_2} 14`}
              />
              <img src={new_year_14} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-15"
                control={<Radio />}
                label={`${name_holiday_2} 15`}
              />
              <img src={new_year_15} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-16"
                control={<Radio />}
                label={`${name_holiday_2} 16`}
              />
              <img src={new_year_16} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-17"
                control={<Radio />}
                label={`${name_holiday_2} 17`}
              />
              <img src={new_year_17} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-18"
                control={<Radio />}
                label={`${name_holiday_2} 18`}
              />
              <img src={new_year_18} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-19"
                control={<Radio />}
                label={`${name_holiday_2} 19`}
              />
              <img src={new_year_19} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-20"
                control={<Radio />}
                label={`${name_holiday_2} 20`}
              />
              <img src={new_year_20} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-21"
                control={<Radio />}
                label={`${name_holiday_2} 21`}
              />
              <img src={new_year_21} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-22"
                control={<Radio />}
                label={`${name_holiday_2} 22`}
              />
              <img src={new_year_22} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-23"
                control={<Radio />}
                label={`${name_holiday_2} 23`}
              />
              <img src={new_year_23} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-24"
                control={<Radio />}
                label={`${name_holiday_2} 24`}
              />
              <img src={new_year_24} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-25"
                control={<Radio />}
                label={`${name_holiday_2} 25`}
              />
              <img src={new_year_25} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-26"
                control={<Radio />}
                label={`${name_holiday_2} 26`}
              />
              <img src={new_year_26} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-27"
                control={<Radio />}
                label={`${name_holiday_2} 27`}
              />
              <img src={new_year_27} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-28"
                control={<Radio />}
                label={`${name_holiday_2} 28`}
              />
              <img src={new_year_28} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel
                className="btn"
                value="new-year-29"
                control={<Radio />}
                label={`${name_holiday_2} 29`}
              />
              <img src={new_year_29} alt="" width={64} />
            </div>
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
