import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import CheckIcon from '@mui/icons-material/Check';
import weatherImage from 'components/Weather/weatherIcon';

const codes = [
  'clear-day',
  'clear-night',
  'partly-cloudy-day',
  'rain-snow',
  'snow-showers-day',
  'thunder-showers-night',
  'hail',
  'showers-night',
  'sleet',
];

export const TabPanel1WeatherIcon = () => {
  const dispatch = useDispatch();

  const THEME_WIDGET_CHANGE = useSelector(rootSelectors.getThemeIconWeather);
  const [value, setValue] = useState(THEME_WIDGET_CHANGE);

  const handleChange = key => {
    dispatch(dataActions.setThemeIconWeather(key));
    setValue(key);
  };

  return (
    <div className="weather-variants">
      {[0, 1, 2, 3].map(v => (
        <div
          key={v}
          className={`weather-variant-card${value === v ? ' weather-variant-card--selected' : ''}`}
          onClick={() => handleChange(v)}
          role="radio"
          aria-checked={value === v}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleChange(v);
            }
          }}
        >
          <span className="weather-variant-card__title">Вариант {v + 1}</span>
          {value === v && (
            <span className="weather-variant-card__check">
              <CheckIcon />
            </span>
          )}
          <div className="weather-variant-card__icons">
            {codes.map(code => (
              <div className="weather-img-block__item" key={code}>
                <img src={weatherImage(code, v)} alt="" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
