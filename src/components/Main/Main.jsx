import * as React from 'react';
import { useSelector } from 'react-redux';

import { Weather } from './Weather';
import { Radio } from './Radio';
import { Currency } from './Currency';
import { Clock } from './Clock';
import { Event } from './Event';
import { ClockDigital } from './ClockDigital';
import { getThemeWidgetClock } from 'store/selectors';

export const Main = ({ onAudio }) => {
  const WIDGET = useSelector(getThemeWidgetClock);
  console.log(WIDGET);
  return (
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
  );
};
