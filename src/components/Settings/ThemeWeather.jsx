import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeIconWeather } from 'store/root/actions';
import { getThemeIconWeather } from 'store/root/selectors';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import weatherImage from 'components/Weather/weatherIcon';

export const ThemeWeather = () => {
  const dispatch = useDispatch();

  const THEME_WIDGET_CHANGE = useSelector(getThemeIconWeather);
  const [value, setValue] = useState(THEME_WIDGET_CHANGE);
  const image1 = weatherImage('clear-day', value);
  const image2 = weatherImage('clear-night', value);
  const image3 = weatherImage('partly-cloudy-day', value);
  const image4 = weatherImage('rain-snow', value);
  const image5 = weatherImage('snow-showers-day', value);
  const image6 = weatherImage('thunder-showers-night', value);
  const image7 = weatherImage('hail', value);
  const image8 = weatherImage('showers-night', value);
  const image9 = weatherImage('sleet', value);

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
        <div className="weather-settings">
          <div className="weather-settings__btn">
            <FormControlLabel className="btn" value={0} control={<Radio />} label="Вариант 1" />
            <FormControlLabel className="btn" value={1} control={<Radio />} label="Вариант 2" />
            <FormControlLabel className="btn" value={2} control={<Radio />} label="Вариант 3" />
            <FormControlLabel className="btn" value={3} control={<Radio />} label="Вариант 4" />
          </div>
          <p className="weather-settings__title">Образец</p>
          <div className="weather-img-block">
            <div className="weather-img-block__item">
              <img src={image1} alt="" width={80} />
            </div>
            <div className="weather-img-block__item">
              <img src={image2} alt="" width={80} />
            </div>
            <div className="weather-img-block__item">
              <img src={image3} alt="" width={100} />
            </div>
            <div className="weather-img-block__item">
              <img src={image4} alt="" width={100} />
            </div>
            <div className="weather-img-block__item">
              <img src={image5} alt="" width={100} />
            </div>
            <div className="weather-img-block__item">
              <img src={image6} alt="" width={100} />
            </div>
            <div className="weather-img-block__item">
              <img src={image7} alt="" width={100} />
            </div>
            <div className="weather-img-block__item">
              <img src={image8} alt="" width={100} />
            </div>
            <div className="weather-img-block__item">
              <img src={image9} alt="" width={100} />
            </div>
          </div>
        </div>
      </RadioGroup>
    </FormControl>
  );
};
