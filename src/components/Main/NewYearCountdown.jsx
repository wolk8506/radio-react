import * as React from 'react';
import { useEffect, useState } from 'react';

import countdownGlobe from '../../images/winter/countdown-globe.png';
import countdownGlobe_1 from '../../images/winter/countdown-globe-1.png';
import countdownGlobe_2 from '../../images/winter/countdown-globe-2.png';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const NewYearCountdown = () => {
  //   const clock_AnalogDigital = useSelector(getThemeClock_AnalogDigital);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  const setClock = () => {
    const clockNull = i => {
      if (String(i).length < 2) {
        return '0' + i;
      } else return i;
    };

    const comingYear = new Date().getFullYear() + 1;
    const comingDate = new Date(`Jan 1, ${comingYear} 00:00:00`);

    const now = new Date();
    const remainingTime = comingDate.getTime() - now.getTime();

    setDays(clockNull(Math.floor(remainingTime / (1000 * 60 * 60 * 24))));
    setHours(clockNull(Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))));
    setMins(clockNull(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))));
    setSecs(clockNull(Math.floor((remainingTime % (1000 * 60)) / 1000)));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClock();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------------------------------

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  return (
    <div>
      <div className="xmas-timer">
        <div className="xmas-timer__item xmas-timer__item-1">
          <div className="time">{days}</div>
          <div className="label">days</div>
        </div>
        <img className="globe-1" src={countdownGlobe_1} alt="" />

        <div className="xmas-timer__item xmas-timer__item-2">
          <div className="time">{hours}</div>
          <div className="label">hours</div>
        </div>
        <img className="globe-2" src={countdownGlobe_2} alt="" />
        <div className="xmas-timer__item xmas-timer__item-3">
          <div className="time">{mins}</div>
          <div className="label">minutes</div>
        </div>
        <img className="globe-3" src={countdownGlobe_1} alt="" />
        <div className="xmas-timer__item xmas-timer__item-4">
          <div className="time">{secs}</div>
          <div className="label">seconds</div>
        </div>
        <img className="globe-4" src={countdownGlobe} alt="" />
      </div>
    </div>
  );
};
