import * as React from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeThemeBackground } from 'store/actions';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import img_1 from '../../images/wallpaper/img_1_128.webp';
import img_2 from '../../images/wallpaper/img_2_128.webp';
import img_3 from '../../images/wallpaper/img_3_128.webp';
import img_4 from '../../images/wallpaper/img_4_128.webp';
import img_5 from '../../images/wallpaper/img_5_128.webp';
import img_6 from '../../images/wallpaper/img_6_128.webp';
import img_7 from '../../images/wallpaper/img_7_128.webp';
import img_8 from '../../images/wallpaper/img_8_128.webp';
import img_9 from '../../images/wallpaper/img_9_128.webp';
import img_10 from '../../images/wallpaper/img_10_128.webp';
import img_11 from '../../images/wallpaper/img_11_128.webp';
import img_12 from '../../images/wallpaper/img_12_128.webp';
import img_13 from '../../images/wallpaper/img_13_128.webp';
import img_14 from '../../images/wallpaper/img_14_128.webp';
import img_15 from '../../images/wallpaper/img_15_128.webp';
import img_16 from '../../images/wallpaper/img_16_128.webp';
import img_17 from '../../images/wallpaper/img_17_128.webp';
import img_18 from '../../images/wallpaper/img_18_128.webp';
import img_19 from '../../images/wallpaper/img_19_128.webp';
import img_20 from '../../images/wallpaper/img_20_128.webp';
import img_21 from '../../images/wallpaper/img_21_128.webp';
import img_22 from '../../images/wallpaper/img_22_128.webp';
import img_23 from '../../images/wallpaper/img_23_128.webp';
import img_24 from '../../images/wallpaper/img_24_128.webp';
import img_25 from '../../images/wallpaper/img_25_128.webp';
import logo from '../../images/pngegg.png';

export const ThemeChangeBackground = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(state => state.storeData.themeBackground);

  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleChange = e => {
    dispatch(changeThemeBackground(e.target.value));
    setValue(e.target.value);
    // console.log('1', e.target.value);
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
              <FormControlLabel className="btn" value="color-02" control={<Radio />} label="Цвет 2" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-03" control={<Radio />} label="Цвет 3" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-04" control={<Radio />} label="Цвет 4" />{' '}
              <div className="item-background-color"></div>
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="color-05" control={<Radio />} label="Цвет 5" />{' '}
              <div className="item-background-color"></div>
            </div>
          </div>
          <div className="wallpaper-collection__item">
            <p>Разное</p>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-23" control={<Radio />} label="Картинка 23" />
              <img src={img_23} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-24" control={<Radio />} label="Картинка 24" />
              <img src={img_24} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-25" control={<Radio />} label="Картинка 25" />
              <img src={img_25} alt="" width={64} />
            </div>

            <div className="item-background">
              <FormControlLabel className="btn" value="img-1" control={<Radio />} label="Картинка 1" />
              <img src={img_1} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-2" control={<Radio />} label="Картинка 2" />
              <img src={img_2} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-3" control={<Radio />} label="Картинка 3" />
              <img src={img_3} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-4" control={<Radio />} label="Картинка 4" />
              <img src={img_4} alt="" width={64} />
            </div>

            <div className="item-background">
              <FormControlLabel className="btn" value="img-5" control={<Radio />} label="Картинка 5" />
              <img src={img_5} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-6" control={<Radio />} label="Картинка 6" />
              <img src={img_6} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-7" control={<Radio />} label="Картинка 7" />
              <img src={img_7} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-8" control={<Radio />} label="Картинка 8" />
              <img src={img_8} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-9" control={<Radio />} label="Картинка 9" />
              <img src={img_9} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-10" control={<Radio />} label="Картинка 10" />
              <img src={img_10} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-11" control={<Radio />} label="Картинка 11" />
              <img src={img_11} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-16" control={<Radio />} label="Картинка 16" />
              <img src={img_16} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-17" control={<Radio />} label="Картинка 17" />
              <img src={img_17} alt="" width={64} />
            </div>
          </div>
          <div className="wallpaper-collection__item">
            <p>Хэллоуин</p>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-12" control={<Radio />} label="Картинка 12" />
              <img src={img_12} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-13" control={<Radio />} label="Картинка 13" />
              <img src={img_13} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-14" control={<Radio />} label="Картинка 14" />
              <img src={img_14} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-15" control={<Radio />} label="Картинка 15" />
              <img src={img_15} alt="" width={64} />
            </div>

            <div className="item-background">
              <FormControlLabel className="btn" value="img-18" control={<Radio />} label="Картинка 18" />
              <img src={img_18} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-19" control={<Radio />} label="Картинка 19" />
              <img src={img_19} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-20" control={<Radio />} label="Картинка 20" />
              <img src={img_20} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-21" control={<Radio />} label="Картинка 21" />
              <img src={img_21} alt="" width={64} />
            </div>
            <div className="item-background">
              <FormControlLabel className="btn" value="img-22" control={<Radio />} label="Картинка 22" />
              <img src={img_22} alt="" width={64} />
            </div>
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
