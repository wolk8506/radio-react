import * as React from 'react';

import { Weather } from './Weather';
import { Radio } from './Radio';
import { Currency } from './Currency';
import { Clock } from './Clock';
import { Event } from './Event';

export const Main = ({ onAudio }) => {
  return (
    <div className="main">
      <div className="main__block">
        <div className="block__element">
          <Weather></Weather>
        </div>
        <div className="block__element">
          <Clock></Clock>
        </div>
      </div>
      <div className="main__block">
        <Radio onAudio={onAudio}></Radio>
        <Currency></Currency>
        <Event></Event>
      </div>
    </div>
  );
};
