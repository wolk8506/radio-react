import * as React from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeThemeBackground } from 'store/actions';

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

import logo from '../../images/pngegg.png';

export const ThemeChangeBackground = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(state => state.storeData.themeBackground);
  const name_holiday = 'Хэллоуин';

  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleChange = e => {
    dispatch(changeThemeBackground(e.target.value));
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
        </div>
      </RadioGroup>
    </FormControl>
  );
};
