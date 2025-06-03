import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import weatherImage from 'components/Weather/weatherIcon';

export const TabPanel1WeatherIcon = () => {
  const dispatch = useDispatch();

  const THEME_WIDGET_CHANGE = useSelector(rootSelectors.getThemeIconWeather);
  const [value, setValue] = useState(THEME_WIDGET_CHANGE);
  const image = [
    weatherImage('clear-day', value),
    weatherImage('clear-night', value),
    weatherImage('partly-cloudy-day', value),
    weatherImage('rain-snow', value),
    weatherImage('snow-showers-day', value),
    weatherImage('thunder-showers-night', value),
    weatherImage('hail', value),
    weatherImage('showers-night', value),
    weatherImage('sleet', value),
  ];

  const handleChange = e => {
    dispatch(dataActions.setThemeIconWeather(e.target.value));
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
        <div className="weather-settings">
          <div className="weather-settings__btn">
            <FormControlLabel className="btn" value={0} control={<Radio />} label="Вариант 1" />
            <FormControlLabel className="btn" value={1} control={<Radio />} label="Вариант 2" />
            <FormControlLabel className="btn" value={2} control={<Radio />} label="Вариант 3" />
            <FormControlLabel className="btn" value={3} control={<Radio />} label="Вариант 4" />
          </div>
          <p className="weather-settings__title">Образец</p>
          <div className="weather-img-block">
            {image.map((i, index) => {
              return (
                <div className="weather-img-block__item" key={index}>
                  <img src={i} alt="" width={100} />
                </div>
              );
            })}
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
