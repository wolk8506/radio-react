import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Fade, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import moment from 'moment';
import 'moment/locale/ru';

import { rootSelectors } from 'store';
import { radioData } from '../CardRadio/Radio-data';
import { useRadioNowPlaying } from '../CardRadio/useRadioNowPlaying';
import { playStream, resumeStream, isCurrentStream } from '../CardRadio/playStream';

moment.locale('ru');

const INK = '#1a1408';
const TICK = '#5c4a22';
const SECOND = '#efe6d2';
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const AnalogClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      if (hourRef.current) hourRef.current.setAttribute('transform', `rotate(${h * 30} 200 200)`);
      if (minuteRef.current) minuteRef.current.setAttribute('transform', `rotate(${m * 6} 200 200)`);
      if (secondRef.current) secondRef.current.setAttribute('transform', `rotate(${s * 6} 200 200)`);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = 200;
  const cy = 200;
  const HALF = 186;
  const CORNER = 36;
  const MINUTE_LEN = 12;
  const FIVE_LEN = 48;
  const CARDINAL_LEN = 28;

  const pointOnRoundedSquare = angle => {
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const ax = Math.abs(ux);
    const ay = Math.abs(uy);
    const inner = HALF - CORNER;
    let t;
    if (ay > 1e-9 && (ax * HALF) / ay <= inner) {
      t = HALF / ay;
    } else if (ax > 1e-9 && (ay * HALF) / ax <= inner) {
      t = HALF / ax;
    } else {
      const kx = Math.sign(ux) * inner;
      const ky = Math.sign(uy) * inner;
      const b = ux * kx + uy * ky;
      t = b + Math.sqrt(Math.max(b * b - (kx * kx + ky * ky - CORNER * CORNER), 0));
    }
    return { x: cx + ux * t, y: cy + uy * t };
  };

  const ticks = [];
  for (let i = 0; i < 60; i += 1) {
    const isCardinal = i % 15 === 0;
    const isFive = i % 5 === 0 && !isCardinal;
    const len = isCardinal ? CARDINAL_LEN : isFive ? FIVE_LEN : MINUTE_LEN;
    const width = isCardinal || isFive ? 3.1 : 1.7;
    const color = isFive || isCardinal ? INK : TICK;
    const outer = pointOnRoundedSquare(((i * 6 - 90) * Math.PI) / 180);
    const vx = cx - outer.x;
    const vy = cy - outer.y;
    const inv = 1 / (Math.hypot(vx, vy) || 1);
    ticks.push(
      <line
        key={i}
        x1={outer.x + vx * inv * len}
        y1={outer.y + vy * inv * len}
        x2={outer.x}
        y2={outer.y}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  }

  const numerals = [
    { n: '12', x: 200, y: 88 },
    { n: '3', x: 312, y: 204 },
    { n: '6', x: 200, y: 312 },
    { n: '9', x: 88, y: 204 },
  ];

  return (
    <svg className="standby-clock-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {ticks}
      {numerals.map(({ n, x, y }) => (
        <text
          key={n}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={INK}
          fontSize="52"
          fontWeight="500"
          fontFamily='system-ui, "Segoe UI", sans-serif'
        >
          {n}
        </text>
      ))}
      <g ref={hourRef}>
        <line x1="200" y1="200" x2="200" y2="176" stroke={INK} strokeWidth="4.4" strokeLinecap="round" />
        <rect x="194" y="88" width="12" height="88" rx="6" fill={INK} />
      </g>
      <g ref={minuteRef}>
        <line x1="200" y1="200" x2="200" y2="176" stroke={INK} strokeWidth="4.4" strokeLinecap="round" />
        <rect x="194.375" y="21" width="11.25" height="155" rx="5.625" fill={INK} />
      </g>
      <circle cx="200" cy="200" r="6.75" fill={SECOND} />
      <circle cx="200" cy="200" r="8.35" fill="none" stroke={INK} strokeWidth="3.2" />
      <g ref={secondRef}>
        <line x1="200" y1="224" x2="200" y2="16" stroke={SECOND} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <circle cx="200" cy="200" r="4.4" fill={INK} />
    </svg>
  );
};

const MonthCalendar = () => {
  const calendar = useMemo(() => {
    const now = moment();
    const start = now.clone().startOf('month');
    const daysInMonth = now.daysInMonth();
    const offset = start.isoWeekday() - 1;
    const today = now.date();
    const cells = [];
    for (let i = 0; i < offset; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return { month: now.format('MMMM').toUpperCase(), today, cells };
  }, []);

  return (
    <div className="standby-cal">
      <Typography className="standby-cal-month standby-muted">{calendar.month}</Typography>
      <div className="standby-cal-grid">
        {WEEKDAYS.map(d => (
          <Typography key={d} className="standby-cal-wd standby-faint">
            {d}
          </Typography>
        ))}
        {calendar.cells.map((day, i) => (
          <div key={i} className="standby-cal-cell">
            {day ? (
              <span className={`standby-cal-day${day === calendar.today ? ' is-today' : ''}`}>{day}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export const StandByModal = ({ open, onClose, onAudio }) => {
  const PLAYER_STATION = useSelector(rootSelectors.getPlayerStation);
  const station = PLAYER_STATION ?? 0;
  const currentStation = radioData[station] || radioData[0];
  const nowPlayingMap = useRadioNowPlaying();
  const np = nowPlayingMap?.[currentStation?.id] || null;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!onAudio) return undefined;
    const id = setInterval(() => setIsPlaying(!onAudio.paused), 400);
    setIsPlaying(!onAudio.paused);
    return () => clearInterval(id);
  }, [onAudio, open]);

  let artistName = np?.artist || '';
  let songTitle = np?.track || np?.title || '';
  if (!artistName && songTitle.includes('—')) {
    const p = songTitle.split('—');
    artistName = p[0].trim();
    songTitle = p.slice(1).join('—').trim();
  } else if (!artistName && songTitle.includes('-')) {
    const p = songTitle.split('-');
    artistName = p[0].trim();
    songTitle = p.slice(1).join('-').trim();
  }
  if (!artistName && !songTitle) {
    songTitle = currentStation?.name || 'Радио';
    artistName = 'Прямой эфир';
  } else if (!artistName) {
    artistName = currentStation?.name || 'Радио';
  }

  const cover = np?.cover || currentStation?.logo;

  const handlePlayPause = useCallback(() => {
    if (!onAudio || !currentStation) return;
    if (isPlaying) {
      onAudio.pause();
      setIsPlaying(false);
      return;
    }
    if (!isCurrentStream(currentStation.url)) playStream(onAudio, currentStation.url);
    else resumeStream(onAudio, currentStation.url);
    setIsPlaying(true);
  }, [onAudio, currentStation, isPlaying]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Fade}
      transitionDuration={280}
      disableScrollLock
      className="standby-modal"
      sx={{ zIndex: 1600 }}
      PaperProps={{
        className: 'standby-dialog-paper',
        sx: { color: INK, overflow: 'hidden', m: 0 },
      }}
    >
      <IconButton className="standby-close" aria-label="Закрыть" onClick={onClose}>
        <CloseIcon />
      </IconButton>

      <div className="standby-layout">
        <div className="standby-side">
          <div className="standby-radio">
            <img
              className="standby-cover"
              src={cover}
              alt={currentStation?.name || 'Радио'}
              onError={e => {
                if (currentStation?.logo && e.currentTarget.src !== currentStation.logo) {
                  e.currentTarget.src = currentStation.logo;
                }
              }}
            />
            <div>
              <Typography className="standby-title">{songTitle}</Typography>
              <Typography className="standby-artist standby-muted">{artistName}</Typography>
            </div>
            <button
              type="button"
              className="standby-play"
              onClick={handlePlayPause}
              disabled={!onAudio}
              aria-label={isPlaying ? 'Пауза' : 'Играть'}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
          <MonthCalendar />
        </div>

        <div className="standby-clock-host">
          <div className="standby-clock-face">
            <AnalogClock />
          </div>
        </div>
      </div>
    </Dialog>
  );
};
