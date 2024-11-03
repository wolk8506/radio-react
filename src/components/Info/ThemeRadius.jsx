import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeWidgetClock, setThemeTransporantClock } from 'store/actions';
import { getThemeWidgetClock, getThemeTransporantClock } from 'store/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';

export const ThemeRadius = () => {
  const dispatch = useDispatch();

  const THEME_WIDGET_CHANGE = useSelector(getThemeWidgetClock);
  const [value, setValue] = useState(THEME_WIDGET_CHANGE);

  const handleChange = e => {
    dispatch(setThemeWidgetClock(e.target.value));
    setValue(e.target.value);
  };

  // ----------
  const THEME_T_C = useSelector(getThemeTransporantClock);
  const THEME_T_C_number = Number(THEME_T_C.slice(0, -1));
  // console.log(THEME_T_C);
  // console.log(THEME_T_C_number);

  const [value2, setValue2] = useState(THEME_T_C_number);

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
    dispatch(setThemeTransporantClock(`${newValue}%`));
  };

  // useLayoutEffect(() => {
  //   document.documentElement.style.setProperty('--color-test', 'red');
  // }, [value2]);

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
      <FormLabel id="controlled-radio-widget">Прозрачность для "Вариант 2" -- {THEME_T_C}</FormLabel>
      <Slider aria-label="Volume" value={value2} onChange={handleChange2} />
    </FormControl>
  );
};
