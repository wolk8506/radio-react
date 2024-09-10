import { useEffect, useState } from 'react';
import * as React from 'react';

// import s from './Clock2.module.css';

export const Clock = () => {
  const [hh, setHh] = useState('00');
  const [mm, setMm] = useState('00');
  const [ss, setSs] = useState('00');
  const [hh2, setHh2] = useState('00');
  const [mm2, setMm2] = useState('00');
  const [ss2, setSs2] = useState('00');

  const [changeSecond, setChangeSecond] = useState(true);
  const [changeMinute, setChangeMinute] = useState(true);
  const [changeHour, setChangeHour] = useState(true);

  const setClock = () => {
    let day = new Date();

    const clockNull = i => {
      if (String(i).length < 2) {
        return '0' + i;
      } else return i;
    };

    setHh(clockNull(day.getHours()));
    setMm(clockNull(day.getMinutes()));
    setSs(clockNull(day.getSeconds()));

    setChangeHour(false);
    setChangeMinute(false);
    setChangeSecond(false);
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    const interval = setInterval(() => {
      setClock();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setChangeSecond(true);
    const interval = setInterval(() => {
      setSs2(ss);
    }, 500);

    return () => clearInterval(interval);
  }, [ss]);

  useEffect(() => {
    setChangeMinute(true);
    const interval = setInterval(() => {
      setMm2(mm);
    }, 500);

    return () => clearInterval(interval);
  }, [mm]);

  useEffect(() => {
    setChangeHour(true);
    const interval = setInterval(() => {
      setHh2(hh);
    }, 500);

    return () => clearInterval(interval);
  }, [hh]);

  return (
    <div className="wrapper">
      <div className="clock">
        <div className="flipper">
          <div className="gear"></div>
          <div className="gear"></div>
          <div className="top">
            <div className="text">{hh}</div>
          </div>
          {changeHour && (
            <div className="top_new">
              <div className="text_top_new">{hh2}</div>
              <div className="bottom_new">
                <div className="text_bottom">{hh}</div>
              </div>
            </div>
          )}
          <div className="bottom">
            <div className="text_bottom">{hh2}</div>
          </div>
        </div>

        <div className="flipper">
          <div className="gear"></div>
          <div className="gear"></div>
          <div className="top">
            <div className="text">{mm}</div>
          </div>
          {changeMinute && (
            <div className="top_new">
              <div className="text_top_new">{mm2}</div>
              <div className="bottom_new">
                <div className="text_bottom">{mm}</div>
              </div>
            </div>
          )}
          <div className="bottom">
            <div className="text_bottom">{mm2}</div>
          </div>
        </div>

        <div className="flipper">
          <div className="gear"></div>
          <div className="gear"></div>
          <div className="top">
            <div className="text">{ss}</div>
          </div>
          {changeSecond && (
            <div className="top_new">
              <div className="text_top_new">{ss2}</div>
              <div className="bottom_new">
                <div className="text_bottom">{ss}</div>
              </div>
            </div>
          )}
          <div className="bottom">
            <div className="text_bottom">{ss2}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
