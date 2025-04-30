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

import img_4 from '../../images/wallpaper/different/img_4_128.webp';

import img_6 from '../../images/wallpaper/different/img_6_128.webp';
import img_7 from '../../images/wallpaper/different/img_7_128.webp';

import img_10 from '../../images/wallpaper/different/img_10_128.webp';
import img_11 from '../../images/wallpaper/different/img_11_128.webp';
import img_12 from '../../images/wallpaper/different/img_12_128.webp';
import img_13 from '../../images/wallpaper/different/img_13_128.webp';
import img_14 from '../../images/wallpaper/different/img_14_128.webp';
import img_15 from '../../images/wallpaper/different/img_15_128.webp';
import img_16 from '../../images/wallpaper/different/img_16_128.webp';

export const ThemeBackgroundImg = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(getThemeChengeWalpaper);

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
            <p>Разное</p>

            <div className="item-background">
              <FormControlLabel className="btn" value="img-4" control={<Radio />} label="Изображение 4" />
              <img src={img_4} alt="" width={64} />
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
        </div>
      </RadioGroup>
    </FormControl>
  );
};
