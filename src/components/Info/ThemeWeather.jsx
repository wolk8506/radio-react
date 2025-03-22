import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeIconWeather } from 'store/actions';
import { getThemeIconWeather } from 'store/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const ThemeWeather = () => {
  const dispatch = useDispatch();

  const THEME_WIDGET_CHANGE = useSelector(getThemeIconWeather);
  const [value, setValue] = useState(THEME_WIDGET_CHANGE);

  const handleChange = e => {
    dispatch(setThemeIconWeather(e.target.value));
    setValue(e.target.value);
  };

  return (
    <FormControl className="form-auto-chenge-theme">
      <FormLabel id="controlled-radio-widget">Вид значков погоды</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-widget"
        name="radio-theme-auto"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel className="btn" value={0} control={<Radio />} label="Вариант 1" />
        {/* <Divider /> */}
        <FormControlLabel className="btn" value={1} control={<Radio />} label="Вариант 2" />
        <FormControlLabel className="btn" value={2} control={<Radio />} label="Вариант 3" />
        <FormControlLabel className="btn" value={3} control={<Radio />} label="Вариант 4" />
      </RadioGroup>
    </FormControl>
  );
};
