import * as React from 'react';

import { Clock2 } from '../../components/Main/Clock';
import { Event } from '../../components/Main/Event';
import s from './Clock.module.css';

export const Clock = () => {
  return (
    <div className={s.calendarBlock}>
      <Clock2></Clock2>
      <Event></Event>
    </div>
  );
};
