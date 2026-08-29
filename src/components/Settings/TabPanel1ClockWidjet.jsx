import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';

const clockOptions = [
  { value: 'timeHero', label: 'TimeHero' },
  { value: 'clock', label: 'Flip-часы (Clock)' },
  { value: 'timeHeroHalloween', label: 'TimeHero — Хэллоуин' },
  { value: 'timeHeroNewYear', label: 'TimeHero — Новый год' },
];

const weatherOptions = [
  { value: 'weatherCard', label: 'Карточка (WeatherCard)' },
  { value: 'weatherCardHalloween', label: 'Карточка — Хэллоуин' },
  { value: 'weather', label: 'Flip-погода (Weather)' },
];

export const TabPanel1ClockWidjet = ({
  mainClockValue,
  onMainClockChange,
  mainWeatherValue,
  onMainWeatherChange,
}) => {
  return (
    <div className="form-auto-change-theme">
      <div className="mac-list">
        <div className="mac-list__title">Часы на главной странице</div>
        {clockOptions.map(opt => (
          <div
            key={opt.value}
            className={`mac-row${mainClockValue === opt.value ? ' mac-row--selected' : ''}`}
            onClick={() => onMainClockChange(opt.value)}
            role="radio"
            aria-checked={mainClockValue === opt.value}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMainClockChange(opt.value);
              }
            }}
          >
            <span className="mac-row__check">{mainClockValue === opt.value && <CheckIcon />}</span>
            <span className="mac-row__name">{opt.label}</span>
          </div>
        ))}
      </div>

      <div className="theme-clock-divider" />

      <div className="mac-list">
        <div className="mac-list__title">Погода на главной странице</div>
        {weatherOptions.map(opt => (
          <div
            key={opt.value}
            className={`mac-row${mainWeatherValue === opt.value ? ' mac-row--selected' : ''}`}
            onClick={() => onMainWeatherChange(opt.value)}
            role="radio"
            aria-checked={mainWeatherValue === opt.value}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMainWeatherChange(opt.value);
              }
            }}
          >
            <span className="mac-row__check">{mainWeatherValue === opt.value && <CheckIcon />}</span>
            <span className="mac-row__name">{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
