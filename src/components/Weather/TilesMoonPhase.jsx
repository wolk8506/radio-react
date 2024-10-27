import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const TilesMoonPhase = () => {
  const dataEvents = useSelector(state => state.storeWeatherElements);

  useEffect(() => {
    setMoonPhase(dataEvents.days[0].moonphase); //Фаза луны
  }, [dataEvents]);

  const [moonPhase, setMoonPhase] = useState('0');

  const [phaseTitle, setPhaseTitle] = useState('--');

  const [value1, setValue1] = React.useState(0);
  const [value2, setValue2] = React.useState(90);

  const [opacity, setOpacity] = React.useState([0, 0, 0, 0, 1]);
  const [color1, setColor1] = React.useState('rgb(255, 216, 122)');

  useEffect(() => {
    const value = moonPhase * 360;
    if (value <= 90) {
      setValue1(value);
      setOpacity([0, 0, 0, 0, 1]);
      setColor1('var(--color-07)');
    } else if (value > 270) {
      setValue1(value);
      setOpacity([0, 1, 0, 1, 0]);
    } else if (value > 180) {
      setValue2(value);
      setOpacity([1, 1, 0, 0, 1]);
      setColor1('rgb(255, 216, 122)');
    } else if (value > 90) {
      setValue2(value);
      setOpacity([1, 0, 1, 0, 1]);
      setColor1('var(--color-07)');
    }
  }, [moonPhase]);

  useEffect(() => {
    if (moonPhase === 0.0) {
      setPhaseTitle('Новолуние');
    } else if (moonPhase < 0.25) {
      setPhaseTitle('Растущая луна');
    } else if (moonPhase === 0.025) {
      setPhaseTitle('Первая четверть');
    } else if (moonPhase < 0.5) {
      setPhaseTitle('Растущая луна');
    } else if (moonPhase === 0.5) {
      setPhaseTitle('Полнолуние');
    } else if (moonPhase < 0.75) {
      setPhaseTitle('Убывающая луна');
    } else if (moonPhase === 0.75) {
      setPhaseTitle('Последняя четверть');
    } else if (moonPhase < 1) {
      setPhaseTitle('Убывающая луна');
    } else if (moonPhase === 1) {
      setPhaseTitle('Новолуние');
    }
  }, [moonPhase]);

  return (
    <div className="card__item">
      <p className="item__title">Фаза луны</p>
      <div className="moon-phase">
        <div className="moon-phase__moon">
          <div className="moon__circle">
            <div className="phase__disc3" style={{ opacity: `${opacity[1]}` }}></div>
            <div className="phase__disc4" style={{ opacity: `${opacity[3]}` }}></div>
            <div className="phase__phase" style={{ transform: `rotateY(${value1}deg)` }}></div>
            <div className="phase__disc" style={{ background: `${color1}`, opacity: `${opacity[4]}` }}></div>
            <div
              className="phase__phase2"
              style={{ transform: `rotateY(${value2}deg)`, opacity: `${opacity[0]}` }}
            ></div>
            <div className="phase__disc2" style={{ opacity: `${opacity[2]}` }}></div>
          </div>
        </div>

        <div className="moon-phase__block-value">
          <p className="block-value__value">{moonPhase}</p>
          <p className="block-value__caption">Фаза Луны</p>
        </div>
      </div>
      <p className="item__text">{phaseTitle}</p>
    </div>
  );
};
