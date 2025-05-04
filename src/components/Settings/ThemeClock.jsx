import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeWidgetClock, setThemeTransporantClock, setThemeClock_AnalogDigital } from 'store/root/actions';
import {
  getThemeWidgetClock,
  getThemeTransporantClock,
  getThemeClock_AnalogDigital,
  rootSelectors,
} from 'store/root/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Weather } from '../Main/Weather';
import { Clock } from '../Main/Clock';
import { ClockDigital } from '../Main/ClockDigital';

// Добавляем debounce функцию
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export const ThemeClock = () => {
  const dispatch = useDispatch();
  const dynamicImageUrl = useSelector(rootSelectors.getThemeChengeWalpaper);
  const THEME_WIDGET_CHANGE = useSelector(getThemeWidgetClock);
  const [widgetValue, setWidgetValue] = useState(THEME_WIDGET_CHANGE);

  // Оптимизируем обновление Redux, вызываем `dispatch` с задержкой
  const updateTransparency = debounce(newValue => {
    dispatch(setThemeTransporantClock(newValue));
  }, 400); // 200ms задержка

  const handleWidgetChange = e => {
    const newValue = e.target.value;

    dispatch(setThemeWidgetClock(newValue));
    setWidgetValue(newValue);
  };

  // Состояние для прозрачности
  const THEME_T_C = useSelector(getThemeTransporantClock);
  const [transparencyValue, setTransparencyValue] = useState(THEME_T_C);

  const handleTransparencyChange = (event, newValue) => {
    setTransparencyValue(newValue);
    // dispatch(setThemeTransporantClock(newValue));
    updateTransparency(newValue);
  };

  // Состояние для типа часов (аналоговые/цифровые)
  const clockAnalogDigital = useSelector(getThemeClock_AnalogDigital);
  const [isAnalogClock, setIsAnalogClock] = useState(clockAnalogDigital);

  useEffect(() => {
    setIsAnalogClock(clockAnalogDigital);
  }, [clockAnalogDigital]);

  const handleClockTypeChange = event => {
    const isChecked = event.target.checked;
    setIsAnalogClock(isChecked);
    dispatch(setThemeClock_AnalogDigital(isChecked));
  };

  return (
    <FormControl className="form-auto-change-theme">
      <FormLabel id="controlled-radio-widget">Виджет часов и погоды</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-widget"
        name="radio-theme-auto"
        value={widgetValue}
        onChange={handleWidgetChange}
      >
        <FormControlLabel className="btn" value={0} control={<Radio />} label="Вариант 1" />
        <FormControlLabel className="btn" value={1} control={<Radio />} label="Вариант 2" />
      </RadioGroup>

      <div className="theme-clock-divider"></div>

      <div className="clock-example-block" style={{ '--background-image': dynamicImageUrl }}>
        <div className="clock-example">
          {widgetValue === '1' && <ClockDigital></ClockDigital>}
          {widgetValue === '0' && (
            <div className="main__block">
              <div className="block__element">
                <Weather></Weather>
              </div>
              <div className="block__element">
                <Clock></Clock>
              </div>
            </div>
          )}
        </div>
      </div>

      {widgetValue === '1' && (
        <>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography>Аналоговые</Typography>
            <Switch
              checked={isAnalogClock}
              onChange={handleClockTypeChange}
              inputProps={{ 'aria-label': 'Switch between analog and digital clocks' }}
            />
            <Typography>Цифровые</Typography>
          </Stack>
          <div className="theme-clock-divider"></div>
          <FormLabel id="controlled-radio-widget">Прозрачность -- {transparencyValue}%</FormLabel>
          <Slider
            aria-label="Transparency"
            value={transparencyValue}
            onChange={handleTransparencyChange}
            sx={{ width: '80%', marginLeft: 'auto', marginRight: 'auto' }}
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
        </>
      )}
    </FormControl>
  );
};
