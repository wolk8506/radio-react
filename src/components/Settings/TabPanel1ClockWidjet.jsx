import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { rootSelectors, dataActions } from 'store';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { WeatherFlip } from '../../Pages/Main/CardClockWeather/WeatherFlip';
import { WeatherCard } from '../../Pages/Main/CardClockWeather/WeatherCard';
import { WeatherCardHalloween } from '../../Pages/Main/CardClockWeather/WeatherCardHalloween';
import { Clock } from '../../Pages/Main/Clock';
import { TimeHero } from '../../Pages/Main/CardClockWeather/TimeHero';
import { TimeHeroHalloween } from '../../Pages/Main/CardClockWeather/TimeHeroHalloween';
import { TimeHeroNewYear } from '../../Pages/Main/CardClockWeather/TimeHeroNewYear';

export const TabPanel1ClockWidjet = () => {
  const dispatch = useDispatch();
  const dynamicImageUrl = useSelector(rootSelectors.getThemeChengeWalpaper);

  // Часы на главной странице (слот TimeHero)
  const mainClock = useSelector(rootSelectors.getThemeMainClock);
  const [mainClockValue, setMainClockValue] = useState(mainClock);

  const handleMainClockChange = e => {
    const newValue = e.target.value;
    dispatch(dataActions.setThemeMainClock(newValue));
    setMainClockValue(newValue);
  };

  // Погода на главной странице
  const mainWeather = useSelector(rootSelectors.getThemeMainWeather);
  const [mainWeatherValue, setMainWeatherValue] = useState(mainWeather);

  const handleMainWeatherChange = e => {
    const newValue = e.target.value;
    dispatch(dataActions.setThemeMainWeather(newValue));
    setMainWeatherValue(newValue);
  };

  return (
    <FormControl className="form-auto-change-theme">
      <div className="clock-mobile">
        <FormLabel id="controlled-radio-mainclock">Часы на главной странице</FormLabel>
        <RadioGroup
          aria-labelledby="controlled-radio-mainclock"
          name="radio-main-clock"
          value={mainClockValue}
          onChange={handleMainClockChange}
        >
          <FormControlLabel className="btn" value="timeHero" control={<Radio />} label="TimeHero" />
          <FormControlLabel className="btn" value="clock" control={<Radio />} label="Flip-часы (Clock)" />
          <FormControlLabel className="btn" value="timeHeroHalloween" control={<Radio />} label="TimeHero — Хэллоуин" />
          <FormControlLabel className="btn" value="timeHeroNewYear" control={<Radio />} label="TimeHero — Новый год" />
        </RadioGroup>
      </div>

      <div className="theme-clock-divider"></div>

      <div className="clock-mobile">
        <FormLabel id="controlled-radio-mainweather">Погода на главной странице</FormLabel>
        <RadioGroup
          aria-labelledby="controlled-radio-mainweather"
          name="radio-main-weather"
          value={mainWeatherValue}
          onChange={handleMainWeatherChange}
        >
          <FormControlLabel className="btn" value="weatherCard" control={<Radio />} label="Карточка (WeatherCard)" />
          <FormControlLabel className="btn" value="weatherCardHalloween" control={<Radio />} label="Карточка — Хэллоуин" />
          <FormControlLabel className="btn" value="weather" control={<Radio />} label="Flip-погода (Weather)" />
        </RadioGroup>
      </div>

      <div className="theme-clock-divider"></div>

      <div className="clock-example-block" style={{ '--background-image': dynamicImageUrl }}>
        <div className="clock-example">
          <div className="main__block">
            <div className="block__element">
              {mainWeatherValue === 'weather' ? (
                <WeatherFlip></WeatherFlip>
              ) : mainWeatherValue === 'weatherCardHalloween' ? (
                <WeatherCardHalloween></WeatherCardHalloween>
              ) : (
                <WeatherCard></WeatherCard>
              )}
            </div>
            <div className="block__element">
              {mainClockValue === 'clock' ? (
                <Clock></Clock>
              ) : mainClockValue === 'timeHeroHalloween' ? (
                <TimeHeroHalloween></TimeHeroHalloween>
              ) : mainClockValue === 'timeHeroNewYear' ? (
                <TimeHeroNewYear></TimeHeroNewYear>
              ) : (
                <TimeHero></TimeHero>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormControl>
  );
};
