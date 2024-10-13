import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const TilesMoonPhase = () => {
  const dataEvents = useSelector(state => state.storeWeatherElements);

  const [moonPhase, setMoonPhase] = useState('0');
  useEffect(() => {
    // setMoonrise(dataEvents.days[0].moonrise);
    // setMoonset(dataEvents.days[0].moonset);
    setMoonPhase(dataEvents.days[0].moonphase); //Фаза луны
    // setSunrise(dataEvents.days[0].sunrise); //Время рассвета
    // setSunset(dataEvents.days[0].sunset); //Время заката
  }, [dataEvents]);

  const [phase, setPhase] = useState(0);

  const [phaseTitle, setPhaseTitle] = useState('--');

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

  useEffect(() => {
    if (moonPhase <= 0.5) {
      setPhase(-moonPhase * 100 * 0.2);
    } else {
      setPhase(10 - (moonPhase - 0.5) * 100 * 0.2);
    }
  }, [moonPhase]);
  const moonShadow = {
    boxShadow: `0rem 0rem 3rem 0rem #5c5a60, inset ${phase}rem 0rem 0.5rem -1rem #908d98`,
  };

  return (
    <div className="card__item">
      <p className="item__title">Фаза луны</p>
      <div className="moon-phase">
        <div className="moon" style={moonShadow}></div>
        <div className="moon-phase__block-value">
          <p className="block-value__value">{moonPhase}</p>
          <p className="block-value__caption">Фаза Луны</p>
        </div>
      </div>
      <p className="item__text">{phaseTitle}</p>
    </div>
  );
};
