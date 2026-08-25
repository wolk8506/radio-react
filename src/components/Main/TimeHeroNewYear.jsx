import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Chip } from '@mui/material';

import { authSelectors } from 'store';

import moment from 'moment';
import 'moment/locale/ru';

import countdownGlobe_2 from '../../images/winter/countdown-globe-2.png';
import sugrob from '../../images/winter/sugrob.png';
import christmasTree from '../../images/winter/christmas tree.png';
import santaSleigh from '../../images/winter/santa-claus.png';

moment.locale('ru');

const snow = [
  { left: '12%', size: 6, dur: 7, delay: 0 },
  { left: '27%', size: 4, dur: 9, delay: 1.6 },
  { left: '43%', size: 8, dur: 6, delay: 0.8 },
  { left: '58%', size: 5, dur: 8.5, delay: 2.2 },
  { left: '73%', size: 7, dur: 10, delay: 1 },
  { left: '88%', size: 4, dur: 7.5, delay: 2.8 },
];

export const TimeHeroNewYear = () => {
  const username = useSelector(authSelectors.getUsername) || 'Гость';

  const [time, setTime] = useState({ hh: '--', mm: '--', ss: '--' });
  const [fullDate, setFullDate] = useState('');
  const [dayOfYear, setDayOfYear] = useState(0);
  const [weekOfYear, setWeekOfYear] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = moment();
      setTime({
        hh: now.format('HH'),
        mm: now.format('mm'),
        ss: now.format('ss'),
      });
      setFullDate(now.format('dddd, D MMMM YYYY'));
      setDayOfYear(now.dayOfYear());
      setWeekOfYear(now.week());
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const balls = [
    { val: time.hh, offset: -28, digitTop: '105%' },
    { val: time.mm, offset: -31, digitTop: '105%' },
    { val: time.ss, offset: -25, digitTop: '105%' },
  ];

  return (
    <Box
      className="col-6 row-span-5 card-main-page"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '236px',
        '@media (max-width: 768px)': {
          height: 'auto',
          minHeight: 'auto',
        },
        background: 'linear-gradient(135deg, #0b1e3a 0%, #16264e 50%, #3a0d1a 100%)',
        border: '1px solid rgba(255, 213, 74, 0.35)',
        boxShadow:
          '0 0 24px rgba(255, 213, 74, 0.2), inset 0 0 30px rgba(168, 85, 247, 0.12)',
      }}
    >
      {/* Падающий снег */}
      {snow.map((s, i) => (
        <Box
          key={i}
          className="ny-snow"
          sx={{
            left: s.left,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Праздничный декор */}
      <Box sx={{ position: 'absolute', top: 8, right: 12, fontSize: '1.6rem', opacity: 0.9 }}>🎄</Box>

      {/* Декор слева снизу: сугроб, ёлка, Санта */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Box
          component="img"
          src={sugrob}
          alt=""
          sx={{ width: 402, opacity: 0.95, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.25))' }}
        />
        <Box
          component="img"
          src={christmasTree}
          alt=""
          sx={{ width: 182, ml: -50, mb: -2, filter: 'drop-shadow(0 0 10px rgba(255,213,74,0.4))' }}
        />
        <Box
          component="img"
          src={santaSleigh}
          alt=""
          sx={{ width: 70, ml: 0, mb: 4, filter: 'drop-shadow(0 0 8px rgba(255,213,74,0.3))' }}
        />
      </Box>

      {/* Шапка */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.01em',
            background: 'linear-gradient(135deg, #ffd54a 0%, #ff6f61 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 12px rgba(255, 213, 74, 0.45)',
          }}
        >
          🎄 С Новым годом, {username}!
        </Typography>
      </Box>

      {/* Дата — поднята выше */}
      <Box sx={{ position: 'relative', zIndex: 1, mt: '6px' }}>
        <Typography
          sx={{
            fontSize: '0.95rem',
            color: 'rgba(255, 220, 180, 0.85)',
            textTransform: 'capitalize',
          }}
        >
          {fullDate}
        </Typography>
      </Box>

      {/* Основной контент */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          width: '100%',
          my: 'auto',
          position: 'relative',
          zIndex: 1,
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: '12px',
            my: 0,
      
          },
        }}
      >
        <Box sx={{ flex: 1 }} />

        {/* Часы-шары */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            flexShrink: 0,
          }}
        >
          {balls.map((b, i) => (
            <React.Fragment key={i}>
              <Box
                sx={{
                  position: 'relative',
                  width: 74,
                  height: 96,
                  marginTop: b.offset,
                }}
              >
                <Box
                  component="img"
                  src={countdownGlobe_2}
                  alt=""
                  sx={{
                    width: 74,
                    height: 'auto',
                    filter: 'drop-shadow(0 0 8px rgba(255, 213, 74, 0.5))',
                  }}
                />
                <Typography
                  sx={{
                    position: 'absolute',
                    top: b.digitTop,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily: "'Mountains of Christmas', serif",
                    color: '#ffffff',
                    fontSize: '3.5rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    textShadow:
                      '0 0 8px rgba(255, 213, 74, 0.9), 0 0 16px rgba(255, 213, 74, 0.6)',
                  }}
                >
                  {b.val}
                </Typography>
              </Box>

              {i < balls.length - 1 && (
                <Box
                  className="ny-blink"
                  sx={{
                    fontSize: '1.4rem',
                    color: '#ffd54a',
                    mr: '1px',
                    ml:'6px',
                    mt: '-59px',
                    textShadow: '0 0 8px rgba(255, 213, 74, 0.8)',
                  }}
                >
                  ❄
                </Box>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* День / Неделя — правый нижний угол */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 10,
          display: 'flex',
          gap: '6px',
          zIndex: 2,
        }}
      >
        <Chip
          label={`🎁 День ${dayOfYear}`}
          size="small"
          sx={{
            height: '22px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#ffd9a0',
            background: 'rgba(255, 213, 74, 0.15)',
            border: '1px solid rgba(255, 213, 74, 0.4)',
          }}
        />
        <Chip
          label={`🌟 Неделя ${weekOfYear}`}
          size="small"
          sx={{
            height: '22px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#ffb3b3',
            background: 'rgba(255, 111, 97, 0.15)',
            border: '1px solid rgba(255, 111, 97, 0.4)',
          }}
        />
      </Box>
    </Box>
  );
};
