import * as React from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from 'store/actions';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const ThemeChange = () => {
  const dispatch = useDispatch();
  const THEME = useSelector(state => state.storeData.theme);

  const [value, setValue] = useState(THEME);

  const handleChange = e => {
    dispatch(changeTheme(e.target.value));
    setValue(e.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="controlled-radio-theme">Изменение темы</FormLabel>
      <RadioGroup aria-labelledby="controlled-radio-theme" name="radio-theme" value={value} onChange={handleChange}>
        <div className="item-theme">
          <FormControlLabel className="btn" value="dark" control={<Radio />} label="Темная" />
          <div className="theme__color theme__color--scheme-1">
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
          </div>
        </div>
        <div className="item-theme">
          <FormControlLabel className="btn" value="dark-2" control={<Radio />} label="Темная 2" />
          <div className="theme__color theme__color--scheme-2">
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
          </div>
        </div>
        <div className="item-theme">
          <FormControlLabel className="btn" value="light" control={<Radio />} label="Светлая" />
          <div className="theme__color theme__color--scheme-3">
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
          </div>
        </div>
        <div className="item-theme">
          <FormControlLabel className="btn" value="light-2" control={<Radio />} label="Светлая 2" />
          <div className="theme__color theme__color--scheme-4">
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
            <div className="color__item"></div>
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
