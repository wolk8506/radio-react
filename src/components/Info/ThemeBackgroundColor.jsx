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

export const ThemeBackgroundColor = () => {
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
        </div>
      </RadioGroup>
    </FormControl>
  );
};
