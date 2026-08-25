import * as React from 'react';
import { useSelector } from 'react-redux';

import { TimeHero } from './TimeHero';
import { TimeHeroHalloween } from './TimeHeroHalloween';
import { TimeHeroNewYear } from './TimeHeroNewYear';
import { Clock } from './Clock';
import { Weather } from './Weather';
import { WeatherCard } from './WeatherCard';
import { WeatherCardHalloween } from './WeatherCardHalloween';
import { RadioCard } from './RadioCard';
import { CurrencyCard } from './CurrencyCard';
import { DynamicContent } from './DynamicContent';
import { Timers } from './Timers';
import { MyEvents } from './MyEvents';
import { NewYearCountdown } from './NewYearCountdown';

import { rootSelectors } from 'store';

import snowMan from '../../images/winter/snowman-min.png';
import christmasTree from '../../images/winter/christmas tree.png';
import pole from '../../images/winter/pole.png';
import sugrob from '../../images/winter/sugrob.png';
import blueWhiteIgloo from '../../images/winter/blue-white-igloo.png';
import santaSleigh from '../../images/winter/santa-claus.png';

import year from '../../images/winter/year.png';
import snake from '../../images/winter/horse.png';

export const Main = ({ onAudio }) => {
  const THEME_NEW_YEAR = useSelector(rootSelectors.getThemeNewYear);
  const THEME_MAIN_CLOCK = useSelector(rootSelectors.getThemeMainClock);
  const THEME_MAIN_WEATHER = useSelector(rootSelectors.getThemeMainWeather);

  return (
    <>
      <div className="main">
        <div className="dashboard-grid">
          {/* Row 1: TimeHero (7 cols) + Weather (5 cols) */}
          <div className="grid-item time-hero-wrapper">
            {THEME_MAIN_CLOCK === 'clock' ? (
              <Clock />
            ) : THEME_MAIN_CLOCK === 'timeHeroHalloween' ? (
              <TimeHeroHalloween />
            ) : THEME_MAIN_CLOCK === 'timeHeroNewYear' ? (
              <TimeHeroNewYear />
            ) : (
              <TimeHero />
            )}
          </div>
          <div className="grid-item weather-wrapper">
            {THEME_MAIN_WEATHER === 'weather' ? (
              <Weather />
            ) : THEME_MAIN_WEATHER === 'weatherCardHalloween' ? (
              <WeatherCardHalloween />
            ) : (
              <WeatherCard />
            )}
          </div>

          {/* Row 2: Radio (6 cols) + Currency (6 cols) */}
          <div className="grid-item radio-wrapper">
            <RadioCard onAudio={onAudio} />
          </div>
          <div className="grid-item currency-wrapper">
            <CurrencyCard />
          </div>

          {/* Row 3: Event + Fact + Joke (each 4 cols) */}
          <div className="grid-item event-wrapper">
            <DynamicContent type="event" title="Событие" icon="calendar-day" />
          </div>
          <div className="grid-item fact-wrapper">
            <DynamicContent type="fact" title="Факт" icon="lightbulb" />
          </div>
          <div className="grid-item joke-wrapper">
            <DynamicContent type="joke" title="Шутка" icon="face-laugh" />
          </div>

          {/* Row 4: Timers (6 cols) + MyEvents (6 cols) */}
          <div className="grid-item timers-wrapper">
            <Timers />
          </div>
          <div className="grid-item events-wrapper">
            <MyEvents />
          </div>
        </div>

        {THEME_NEW_YEAR.timer && (
          <div className="merry">
            <h1>До Нового года</h1>
            <NewYearCountdown />
          </div>
        )}
      </div>

      {/* New Year decorations */}
      {THEME_NEW_YEAR.sugrob && (
        <div className="sugrob">
          <img src={sugrob} alt="sugrob" />
        </div>
      )}
      {THEME_NEW_YEAR.blueWhiteIgloo && (
        <div className="blue-white-igloo">
          <img src={blueWhiteIgloo} alt="igloo" />
        </div>
      )}
      {THEME_NEW_YEAR.snowMan && (
        <div className="snow-man">
          <img src={snowMan} alt="snowman" />
        </div>
      )}
      {THEME_NEW_YEAR.christmasTree && (
        <div className="christmas-tree">
          <img src={christmasTree} alt="tree" />
        </div>
      )}
      {THEME_NEW_YEAR.pole && (
        <div className="pole">
          <img src={pole} alt="pole" />
        </div>
      )}
      {THEME_NEW_YEAR.santaSleigh && (
        <div className="santa-sleigh">
          <img src={santaSleigh} alt="sleigh" />
        </div>
      )}
      {THEME_NEW_YEAR.year && (
        <div className="year">
          <img src={year} alt="year" />
        </div>
      )}
      {THEME_NEW_YEAR.snake && (
        <div className="snake">
          <img src={snake} alt="snake" />
        </div>
      )}
    </>
  );
};
