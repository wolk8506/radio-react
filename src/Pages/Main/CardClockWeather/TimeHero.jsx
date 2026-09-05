import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { authSelectors } from 'store';

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export const TimeHero = () => {
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
      // setFullDate(now.format('dddd'));
      setFullDate({day:now.format('dddd'), date:now.format('D MMMM YYYY')});
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
        // @include function.card-style;
        width: '100%',
        height: '236px',
        '@media (max-width: 768px)': {
          height: 'auto',
          minHeight: 'auto',
        },
        // borderRadius: '22px',
        // padding: '20px 24px',
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'space-between',
        // boxSizing: 'border-box',
        // position: 'relative',
        // background: 'rgba(30, 35, 45, 0.45)',
        // backdropFilter: 'blur(40px) saturate(210%)',
        // WebkitBackdropFilter: 'blur(40px) saturate(210%)',
        // border: '1px solid rgba(255, 255, 255, 0.18)',
        // boxShadow:
        //   '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
      }}
    >
      {/* Шапка карточки */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <AccessTimeIcon sx={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)' }} />
        {/* <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          Система времени
        </Typography> */}
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 700,
            // color: '#ffffff',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '@media (max-width: 768px)': {
              fontSize: '1.2rem',
            },
          }}
        >
          Привет,{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {username}
          </Box>{' '}
          👋
        </Typography>
      </Box>

      {/* Основной контент во всю ширину */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          width: '100%',
          my: 'auto',
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flex: 1,
            minWidth: 0,
            '@media (max-width: 769px)': { flexDirection: 'row', mt: 1 },
          }}
        >
          {/* <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '@media (max-width: 768px)': {
                fontSize: '1.2rem',
              },
            }}
          >
            Привет,{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {username}
            </Box>{' '}
            👋
          </Typography> */}

          <Typography
            sx={{
              fontSize: '1rem',
              // color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'capitalize',
            }}
          >
            {fullDate.day}
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              // color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'capitalize',
            }}
          >
            {fullDate.date}
          </Typography>

          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              gap: '8px',
              mt: '4px',
              bottom: 20,
              '@media (max-width: 768px)': { top: 20, right: 24 },
              '@media (min-width: 769px)': { left: 24 },
            }}
          >
            <Chip
              label={`День ${dayOfYear}`}
              size="small"
              sx={{
                height: '22px',
                fontSize: '0.7rem',
                fontWeight: 600,
                // color: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--color-02)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            />
            <Chip
              label={`Неделя ${weekOfYear}`}
              size="small"
              sx={{
                height: '22px',
                fontSize: '0.7rem',
                fontWeight: 600,
                // color: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--color-02)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
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
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '14px 22px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <Typography
            sx={{
              fontSize: '5rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              // color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
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
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#a855f7',
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              lineHeight: 1,
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
