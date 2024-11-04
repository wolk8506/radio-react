import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeWidgetClock, setThemeTransporantClock, setThemeClock_AnalogDigital } from 'store/actions';
import { getThemeWidgetClock, getThemeTransporantClock, getThemeClock_AnalogDigital } from 'store/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';

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

  const [value2, setValue2] = useState(THEME_T_C_number);

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
    dispatch(setThemeTransporantClock(`${newValue}%`));
  };

  // ---------

  const clock_AnalogDigital = useSelector(getThemeClock_AnalogDigital);
  const [checkedClock_AnalogDigital, setCheckedClock_AnalogDigital] = React.useState(clock_AnalogDigital);

  React.useEffect(() => {
    setCheckedClock_AnalogDigital(clock_AnalogDigital);
  }, [clock_AnalogDigital]);

  const handleChangeClock_AnalogDigital = event => {
    setCheckedClock_AnalogDigital(event.target.checked);
    dispatch(setThemeClock_AnalogDigital(event.target.checked));
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
        {/* <Divider /> */}
        <FormControlLabel className="btn" value={1} control={<Radio />} label="Вариант 2" />
      </RadioGroup>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>Аналоговые</Typography>
        <Switch
          defaultChecked
          checked={checkedClock_AnalogDigital}
          onChange={handleChangeClock_AnalogDigital}
          inputProps={{ 'aria-label': 'ant design' }}
        />
        <Typography>Цифровые</Typography>
      </Stack>
      <FormLabel id="controlled-radio-widget">Прозрачность для "Вариант 2" -- {THEME_T_C}</FormLabel>
      <Slider aria-label="Volume" value={value2} onChange={handleChange2} />
    </FormControl>
  );
};
