import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeChengeWalpaper } from 'store/actions';
import { getThemeChengeWalpaper } from 'store/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import img_1 from '../../images/wallpaper/different/img_1_128.webp';
import img_2 from '../../images/wallpaper/different/img_2_128.webp';
import img_3 from '../../images/wallpaper/different/img_3_128.webp';
import img_4 from '../../images/wallpaper/different/img_4_128.webp';
import img_5 from '../../images/wallpaper/different/img_5_128.webp';
import img_6 from '../../images/wallpaper/different/img_6_128.webp';
import img_7 from '../../images/wallpaper/different/img_7_128.webp';
import img_8 from '../../images/wallpaper/different/img_8_128.webp';
import img_9 from '../../images/wallpaper/different/img_9_128.webp';
import img_10 from '../../images/wallpaper/different/img_10_128.webp';
import img_11 from '../../images/wallpaper/different/img_11_128.webp';
import img_12 from '../../images/wallpaper/different/img_12_128.webp';
import img_13 from '../../images/wallpaper/different/img_13_128.webp';
import img_14 from '../../images/wallpaper/different/img_14_128.webp';
import img_15 from '../../images/wallpaper/different/img_15_128.webp';
import img_16 from '../../images/wallpaper/different/img_16_128.webp';

import holiday_1 from '../../images/wallpaper/holiday/img_1_128.webp';
import holiday_2 from '../../images/wallpaper/holiday/img_2_128.webp';
import holiday_3 from '../../images/wallpaper/holiday/img_3_128.webp';
import holiday_4 from '../../images/wallpaper/holiday/img_4_128.webp';
import holiday_5 from '../../images/wallpaper/holiday/img_5_128.webp';
import holiday_6 from '../../images/wallpaper/holiday/img_6_128.webp';
import holiday_7 from '../../images/wallpaper/holiday/img_7_128.webp';
import holiday_8 from '../../images/wallpaper/holiday/img_8_128.webp';
import holiday_9 from '../../images/wallpaper/holiday/img_9_128.webp';

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

import logo from '../../images/pngegg.png';

export const ThemeChangeBackground = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(getThemeChengeWalpaper);
  const name_holiday = 'Хэллоуин';
  const name_holiday_2 = 'Новый год';

  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleChange = e => {
    dispatch(setThemeChengeWalpaper(e.target.value));
    setValue(e.target.value);
  };

  return (
    <FormControl>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <FormLabel id="controlled-radio-theme-background">Изменение фона</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-theme-background"
        name="radio-theme-background"
        value={value}
        onChange={handleChange}
      >
        <div className="wallpaper-collection">
          <div className="wallpaper-collection__item">
            <p>Цвета</p>
            <div className="item-background">
              <FormControlLabel className="btn" value="color" control={<Radio />} label="Цвет по умолчанию" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-02" control={<Radio />} label="Цвет 1" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-03" control={<Radio />} label="Цвет 2" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-04" control={<Radio />} label="Цвет 3" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-05" control={<Radio />} label="Цвет 4" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-06" control={<Radio />} label="Цвет 5" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-07" control={<Radio />} label="Цвет 6" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-08" control={<Radio />} label="Цвет 7" />{' '}
              <div className="item-background-color"></div>
            </div>
          </div>

          <div className="wallpaper-collection__item">
            <p>Разное</p>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-1" control={<Radio />} label="Изображение 1" />
              <img src={img_1} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-2" control={<Radio />} label="Изображение 2" />
              <img src={img_2} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-3" control={<Radio />} label="Изображение 3" />
              <img src={img_3} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-4" control={<Radio />} label="Изображение 4" />
              <img src={img_4} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-5" control={<Radio />} label="Изображение 5" />
              <img src={img_5} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-6" control={<Radio />} label="Изображение 6" />
              <img src={img_6} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-7" control={<Radio />} label="Изображение 7" />
              <img src={img_7} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-8" control={<Radio />} label="Изображение 8" />
              <img src={img_8} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-9" control={<Radio />} label="Изображение 9" />
              <img src={img_9} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-10" control={<Radio />} label="Изображение 10" />
              <img src={img_10} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-11" control={<Radio />} label="Изображение 11" />
              <img src={img_11} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-12" control={<Radio />} label="Изображение 12" />
              <img src={img_12} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-13" control={<Radio />} label="Изображение 13" />
              <img src={img_13} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-14" control={<Radio />} label="Изображение 14" />
              <img src={img_14} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-15" control={<Radio />} label="Изображение 15" />
              <img src={img_15} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-16" control={<Radio />} label="Изображение 16" />
              <img src={img_16} alt="" width={64} />
            </div>
          </div>
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

            {/*  */}

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

            {/*  */}
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
