import * as React from 'react';
import { useSelector } from 'react-redux';

import { rootSelectors } from 'store';

import { WeatherFlip } from '../../Pages/Main/CardClockWeather/WeatherFlip';
import { WeatherCard } from '../../Pages/Main/CardClockWeather/WeatherCard';
import { WeatherCardHalloween } from '../../Pages/Main/CardClockWeather/WeatherCardHalloween';
import { Clock } from '../../Pages/Main/Clock';
import { TimeHero } from '../../Pages/Main/CardClockWeather/TimeHero';
import { TimeHeroHalloween } from '../../Pages/Main/CardClockWeather/TimeHeroHalloween';
import { TimeHeroNewYear } from '../../Pages/Main/CardClockWeather/TimeHeroNewYear';

export const TabPanel1ClockPreview = ({ mainClockValue, mainWeatherValue }) => {
  const dynamicImageUrl = useSelector(rootSelectors.getThemeChengeWalpaper);

  return (
    <>
      <p className="settings__title">Предпросмотр</p>
      <div className="clock-example-block" style={{ '--background-image': dynamicImageUrl }}>
        <div className="clock-example">
          <div className="main__block">
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
            <div className="block__element">
              {mainWeatherValue === 'weather' ? (
                <WeatherFlip></WeatherFlip>
              ) : mainWeatherValue === 'weatherCardHalloween' ? (
                <WeatherCardHalloween></WeatherCardHalloween>
              ) : (
                <WeatherCard></WeatherCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
