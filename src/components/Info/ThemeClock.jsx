import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeWidgetClock } from 'store/actions';
import { getThemeWidgetClock } from 'store/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const ThemeClock = () => {
  const dispatch = useDispatch();

  const THEME_WIDGET_CHANGE = useSelector(getThemeWidgetClock);
  const [value, setValue] = useState(THEME_WIDGET_CHANGE);

  const handleChange = e => {
    dispatch(setThemeWidgetClock(e.target.value));
    setValue(e.target.value);
  };
  return (
    <FormControl className="form-auto-chenge-theme">
      <FormLabel id="controlled-radio-widget">Виджет часов и погоды</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-widget"
        name="radio-theme-auto"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel className="btn" value={0} control={<Radio />} label="Вариант 1" />
        <FormControlLabel className="btn" value={1} control={<Radio />} label="Вариант 2" />
      </RadioGroup>
    </FormControl>
  );
};
