import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
// require('twix');

import { styled } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
}));

export const Tiles = ({
  moonPhase,
  sunrise,
  sunset,
  moonrise,
  moonset,
  humidity,
  dew,
}) => {
  const [phase, setPhase] = useState(0);

  const dateA = moment.utc(sunset, 'HH:mm:ss');
  const dateB = moment.utc(sunrise, 'HH:mm:ss');
  const dateC = moment.utc(dateA.diff(dateB)).format('HH:mm:ss');

  const [phaseTitle, setPhaseTitle] = useState('новолуние');
  const [humidityTitle, setHumidityTitle] = useState('Нормальный воздух');

  useEffect(() => {
    if (moonPhase === 0) {
      setPhaseTitle('новолуние');
    } else if (moonPhase < 0.25) {
      setPhaseTitle('растущая луна');
    } else if (moonPhase === 0.025) {
      setPhaseTitle('первая четверть');
    } else if (moonPhase < 0.5) {
      setPhaseTitle('растущая луна');
    } else if (moonPhase === 0.5) {
      setPhaseTitle('полнолуние');
    } else if (moonPhase < 0.75) {
      setPhaseTitle('убывающая луна');
    } else if (moonPhase === 0.75) {
      setPhaseTitle('последняя четверть');
    } else if (moonPhase === 1) {
      setPhaseTitle('убывающая луна');
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

  useEffect(() => {
    if (humidity < 40) {
      setHumidityTitle('Сухой воздух');
    } else if (humidity <= 50) {
      setHumidityTitle('Нормальный воздух');
    } else if (humidity <= 60) {
      setHumidityTitle('Влажный воздух');
    } else if (humidity > 60) {
      setHumidityTitle('Мокрый воздух');
    }
  }, [humidity]);

  return (
    <section className="tiles-block">
      <h2>Сведения о погоде</h2>
      <div className="tiles-block__card">
        <div className="card__item">
          <h3>Солнце</h3>
          <p className="item__logo">☀️</p>
          <div>
            <p>Длительность: {dateC}</p>
            <div>
              <p>Восход: {sunrise}</p>
              <p>Заход: {sunset}</p>
            </div>
          </div>
        </div>
        <div className="card__item">
          <h3>Луна</h3>
          <p className="item__logo">🌕</p>
          <div>
            <p> </p>
            <div>
              <p>Восход: {moonrise}</p>
              <p>Заход: {moonset}</p>
            </div>
          </div>
        </div>
        <div className="card__item">
          <h3>Фаза луны</h3>
          <div className="moon" style={moonShadow}></div>
          <p className="moon-text">Фаза луны: {phaseTitle}</p>
        </div>
        <div className="card__item">
          <h3>Влажность</h3>
          <div className="humidity">
            <div className="humidity-range">
              <BorderLinearProgress
                className="range"
                variant="determinate"
                value={humidity}
              />
              <BorderLinearProgress
                variant="determinate"
                className="range"
                value={humidity}
              />
              <BorderLinearProgress
                variant="determinate"
                className="range"
                value={humidity}
              />
              <BorderLinearProgress
                variant="determinate"
                className="range"
                value={humidity}
              />
              <BorderLinearProgress
                variant="determinate"
                className="range"
                value={humidity}
              />
              <BorderLinearProgress
                variant="determinate"
                className="range"
                value={humidity}
              />
              <BorderLinearProgress
                variant="determinate"
                className="range"
                value={humidity}
              />
            </div>
            <div>
              <p className="humidity-value">{humidity}%</p>
              <p className="humidity-title">{humidityTitle}</p>
              <p className="dew">Точка росы {dew}°</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
