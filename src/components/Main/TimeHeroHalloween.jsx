import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Chip } from '@mui/material';

import { authSelectors } from 'store';

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export const TimeHeroHalloween = () => {
  const username = useSelector(authSelectors.getUsername) || 'Гость';

  const [time, setTime] = useState({ hh: '00', mm: '00', ss: '00' });
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
        background: 'linear-gradient(135deg, #2a0e3a 0%, #3a0d2e 55%, #160a26 100%)',
        border: '1px solid rgba(255, 117, 24, 0.35)',
        boxShadow: '0 0 24px rgba(255, 117, 24, 0.22), inset 0 0 30px rgba(168, 85, 247, 0.15)',
      }}
    >
      {/* Праздничный декор */}
      <Box sx={{ position: 'absolute', top: 8, right: 12, fontSize: '1.6rem', opacity: 0.9 }}>🎃</Box>
      <Box sx={{ position: 'absolute', bottom: 6, left: 10, fontSize: '1.3rem', opacity: 0.7 }}>👻</Box>
      <Box sx={{ position: 'absolute', top: 10, left: 12, fontSize: '1.1rem', opacity: 0.6 }}>🦇</Box>
      <Box sx={{ position: 'absolute', bottom: 8, right: 14, fontSize: '1.1rem', opacity: 0.55 }}>🕸️</Box>

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
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#ff7518',
            textShadow: '0 0 10px rgba(255, 117, 24, 0.5)',
          }}
        >
          🦇 Система времени
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
        {/* Приветствие и дата */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 0 12px rgba(255, 117, 24, 0.6)',
              '@media (max-width: 768px)': {
                fontSize: '1.15rem',
              },
            }}
          >
            BOO! Привет,{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #ff7518 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {username}
            </Box>{' '}
            👻
          </Typography>

          <Typography
            sx={{
              fontSize: '0.95rem',
              color: 'rgba(255, 200, 150, 0.85)',
              textTransform: 'capitalize',
            }}
          >
            {fullDate}
          </Typography>

          <Box sx={{ display: 'flex', gap: '8px', mt: '4px' }}>
            <Chip
              label={`🍬 День ${dayOfYear}`}
              size="small"
              sx={{
                height: '22px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#ffd9a0',
                background: 'rgba(255, 117, 24, 0.15)',
                border: '1px solid rgba(255, 117, 24, 0.4)',
              }}
            />
            <Chip
              label={`🌙 Неделя ${weekOfYear}`}
              size="small"
              sx={{
                height: '22px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#d9b3ff',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
              }}
            />
          </Box>
        </Box>

        {/* Цифровые часы */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '14px 22px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 117, 24, 0.35)',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 0 18px rgba(255, 117, 24, 0.2)',
          }}
        >
          <Typography
            sx={{
              fontSize: '5rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: '#ff8c00',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textShadow: '0 0 16px rgba(255, 140, 0, 0.7)',
              '@media (max-width: 768px)': {
                fontSize: '3rem',
              },
            }}
          >
            {time.hh}:{time.mm}
          </Typography>

          <Typography
            sx={{
              fontSize: '2.1rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: '#a855f7',
              background: 'rgba(168, 85, 247, 0.18)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              lineHeight: 1,
              textShadow: '0 0 12px rgba(168, 85, 247, 0.6)',
              '@media (max-width: 768px)': {
                fontSize: '1.4rem',
                padding: '2px 6px',
              },
            }}
          >
            {time.ss}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
