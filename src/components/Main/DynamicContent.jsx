import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/ru';

// MUI Components
import { Box, Typography, IconButton } from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import anecdoteData from './data/anecdote.json';
import eventsJSON from './data/events.json';

moment.locale('ru');

export const DynamicContent = ({ type, title, icon }) => {
  const today = useMemo(() => moment(), []);
  const dayOfYear = today.dayOfYear();
  const randomIdx = useMemo(() => Math.floor(Math.random() * anecdoteData.length), []);
  const dateKey = today.format('MM-DD');

  const [content, setContent] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let items = [];
    if (type === 'event') {
      items = eventsJSON[dateKey]?.event || [{ title: 'Событий нет', description: '', emoji: '' }];
    } else if (type === 'fact') {
      items = eventsJSON[dateKey]?.fact || [{ title: 'Фактов нет', description: '', emoji: '' }];
    } else if (type === 'joke') {
      const idx1 = dayOfYear - 1;
      const idx2 = (idx1 + 366) % anecdoteData.length;
      items = [
        anecdoteData[idx1]?.joke[0] ?? 'Шутка недоступна',
        anecdoteData[idx2]?.joke[0] ?? 'Шутка недоступна',
        anecdoteData[randomIdx]?.joke[0] ?? 'Шутка недоступна',
      ];
    }
    setContent(items);
    setIndex(0);
  }, [type, dateKey, dayOfYear, randomIdx]);

  useEffect(() => {
    if (paused || content.length <= 1) return;
    const tid = setInterval(() => {
      setIndex(i => (i + 1) % content.length);
    }, 4000);
    return () => clearInterval(tid);
  }, [paused, content.length]);

  const prev = () => setIndex(i => (i + content.length - 1) % content.length);
  const next = () => setIndex(i => (i + 1) % content.length);
  const shuffle = () => setIndex(Math.floor(Math.random() * content.length));

  const current = content[index];
  const isString = typeof current === 'string';
  const isObject = current && typeof current === 'object' && current !== null;

  return (
    <Box
      className="col-4 row-span-4 card-main-page"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        height: '198px',
        // borderRadius: '22px',
        // padding: '18px 20px',
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'space-between',
        // overflow: 'hidden',
        // position: 'relative',

        // // Стили Glassmorphism из test.html
        // background: 'rgba(30, 35, 45, 0.45)',
        // backdropFilter: 'blur(40px) saturate(210%)',
        // WebkitBackdropFilter: 'blur(40px) saturate(210%)',
        // border: '1px solid rgba(255, 255, 255, 0.18)',
        // boxShadow:
        //   '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(255, 255, 255, 0.65)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <i className={`fa-solid fa-${icon}`} style={{ fontSize: '0.85rem' }} />
          {title}
        </Typography>

        {/* Действия с контентом */}
        {content.length > 1 && (
          <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {/* <IconButton
            size="small"
            onClick={shuffle}
            title="Случайно"
            sx={{
              color: 'rgba(255, 255, 255, 0.65)',
              padding: '2px',
              '&:hover': { color: '#fff' },
            }}
          >
            <SyncAltIcon sx={{ fontSize: '0.9rem' }} />
          </IconButton> */}
            <IconButton
              size="small"
              onClick={prev}
              title="Назад"
              sx={{
                color: 'rgba(255, 255, 255, 0.65)',
                padding: '2px',
                '&:hover': { color: '#fff' },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: '0.8rem' }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={next}
              title="Вперёд"
              sx={{
                color: 'rgba(255, 255, 255, 0.65)',
                padding: '2px',
                '&:hover': { color: '#fff' },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: '0.8rem' }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Основной контент */}
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          my: 'auto',
          py: 1,
        }}
      >
        {content.length === 0 ? (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.85rem' }}>Загрузка...</Typography>
        ) : isString ? (
          <Typography
            sx={{
              fontSize: '0.85rem',
              lineHeight: 1.4,
              color: 'rgba(255, 255, 255, 0.9)',
              whiteSpace: 'pre-line',
            }}
          >
            {current}
          </Typography>
        ) : isObject ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {current.emoji && <Typography sx={{ fontSize: '1.2rem', lineHeight: 1 }}>{current.emoji}</Typography>}
            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.3,
              }}
            >
              {current.title ?? ''}
            </Typography>
            {current.description && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.3,
                  mt: '2px',
                }}
              >
                {current.description}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.85rem' }}>—</Typography>
        )}
      </Box>

      {/* Счетчик страниц */}
      {content.length > 0 && (
        <Typography
          sx={{
            fontSize: '0.65rem',
            color: 'rgba(255, 255, 255, 0.4)',
            textAlign: 'right',
            fontWeight: 500,
          }}
        >
          {index + 1} / {content.length}
        </Typography>
      )}
    </Box>
  );
};
