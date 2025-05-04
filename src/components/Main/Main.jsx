import * as React from 'react';
import { useSelector } from 'react-redux';

import { Weather } from './Weather';
import { Radio } from './Radio';
import { Currency } from './Currency';
import { Clock } from './Clock';
import { Event } from './Event';
import { ClockDigital } from './ClockDigital';
import { getThemeWidgetClock, getThemeNewYear } from 'store/root/selectors';

import snowMan from '../../images/winter/snowman-min.png';
import christmasTree from '../../images/winter/christmas tree.png';
import pole from '../../images/winter/pole.png';
import sugrob from '../../images/winter/sugrob.png';
import blueWhiteIgloo from '../../images/winter/blue-white-igloo.png';
import santaSleigh from '../../images/winter/santa-claus.png';

import year_2025 from '../../images/winter/year_2025.png';
import snake from '../../images/winter/snake.png';

import { NewYearCountdown } from './NewYearCountdown';

export const Main = ({ onAudio }) => {
  const WIDGET = useSelector(getThemeWidgetClock);
  const THEME_NEW_YEAR = useSelector(getThemeNewYear);

  for (let index = 0; index < 200; index++) {}

  return (
    <>
      {THEME_NEW_YEAR.snow && (
        <div className="snow">
          {[...Array(200)].map((_, index) => (
            <div key={index} className="snow__snowflakes"></div>
          ))}
        </div>
      )}
      <div className="main">
        {WIDGET === '1' && <ClockDigital></ClockDigital>}
        {WIDGET === '0' && (
          <div className="main__block">
            <div className="block__element">
              <Weather></Weather>
            </div>
            <div className="block__element">
              <Clock></Clock>
            </div>
          </div>
        )}
        <div className="main__block">
          <Radio onAudio={onAudio}></Radio>
          <Currency></Currency>
          <Event></Event>
        </div>
      </div>
      {THEME_NEW_YEAR.timer && WIDGET !== '0' && (
        <div className="merry">
          <h1>Until New Year</h1>
          <NewYearCountdown></NewYearCountdown>
        </div>
      )}
      {THEME_NEW_YEAR.sugrob && (
        <div className="sugrob">
          <img src={sugrob} alt="christmasTree" />
        </div>
      )}
      {THEME_NEW_YEAR.blueWhiteIgloo && (
        <div className="blue-white-igloo">
          <img src={blueWhiteIgloo} alt="christmasTree" />
        </div>
      )}
      {THEME_NEW_YEAR.snowMan && (
        <div className="snow-man">
          <img src={snowMan} alt="" />
        </div>
      )}
      {THEME_NEW_YEAR.christmasTree && WIDGET !== '0' && (
        <div className="christmas-tree">
          <img src={christmasTree} alt="christmasTree" />
        </div>
      )}

      {THEME_NEW_YEAR.christmasTree && WIDGET === '0' && (
        <div className="christmas-tree-2">
          <img src={christmasTree} alt="christmasTree" />
        </div>
      )}
      {THEME_NEW_YEAR.pole && (
        <div className="pole">
          <img src={pole} alt="christmasTree" />
        </div>
      )}
      {THEME_NEW_YEAR.santaSleigh && (
        <div className="santa-sleigh">
          <img src={santaSleigh} alt="christmasTree" />
        </div>
      )}
      {/* <div className="santa-sleigh">
        <img src={santaSleigh} alt="christmasTree" />
      </div> */}
      {THEME_NEW_YEAR.year && (
        <div className="year-2025">
          <img src={year_2025} alt="christmasTree" />
        </div>
      )}
      {THEME_NEW_YEAR.snake && (
        <div className="snake">
          <img src={snake} alt="christmasTree" />
        </div>
      )}
    </>
  );
};
