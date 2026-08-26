import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import { Box, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

import anecdoteData from './data/anecdote.json';
import eventsJSON from './data/events.json';

export const Event = () => {
  moment.locale('ru');
  const today = moment();
  const dayOfYear = today.dayOfYear();
  const idx1 = dayOfYear - 1;
  const idx2 = (idx1 + 366) % anecdoteData.length;
  const randomIdx = useMemo(() => Math.floor(Math.random() * anecdoteData.length), []);

  const jokes = [
    anecdoteData[idx1]?.joke[0] ?? 'Шутка недоступна',
    anecdoteData[idx2]?.joke[0] ?? 'Шутка недоступна',
    anecdoteData[randomIdx]?.joke[0] ?? 'Шутка недоступна',
  ];

  const todaysEvents = eventsJSON[today.format('MM-DD')]?.event || [];
  const events = todaysEvents.length ? todaysEvents : [{ title: 'Событий нет', description: '', emoji: '' }];

  const todaysFacts = eventsJSON[today.format('MM-DD')]?.fact || [];
  const fact = todaysFacts.length ? todaysFacts : [{ title: 'Фактов нет', description: '', emoji: '' }];

  // события

  // факт
  // const key = today.format('MM-DD');
  // const [fact, setFact] = useState('Факт недоступен');
  // useEffect(() => {
  //   const f = eventsJSON[key]?.fact;
  //   setFact(f && f.length ? f[0] : 'Фактов на сегодня нет');
  // }, [key]);

  const [jIdx, setJIdx] = useState(0);
  const [eIdx, setEIdx] = useState(0);
  const [fIdx, setFIdx] = useState(0);
  const [jPaused, setJPaused] = useState(false);
  const [ePaused, setEPaused] = useState(false);
  const [fPaused, setFPaused] = useState(false);

  // автопрокрутка шуток
  useEffect(() => {
    if (jPaused) return;
    const tid = setInterval(() => {
      setJIdx(i => (i + 1) % jokes.length);
    }, 3000);
    return () => clearInterval(tid);
  }, [jPaused, jokes.length]);

  // автопрокрутка событий
  useEffect(() => {
    if (ePaused) return;
    const tid = setInterval(() => {
      setEIdx(i => (i + 1) % events.length);
    }, 3000);
    return () => clearInterval(tid);
  }, [ePaused, events.length]);

  useEffect(() => {
    if (fPaused) return;
    const tid = setInterval(() => {
      setFIdx(i => (i + 1) % fact.length);
    }, 3000);
    return () => clearInterval(tid);
  }, [fPaused, fact.length]);

  const prev = (idx, setter, len) => setter((idx + len - 1) % len);
  const next = (idx, setter, len) => setter((idx + 1) % len);

  const renderCard = (title, content, key, idx, len, paused, setPaused, setIdx) => (
    <Box
      key={key}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{ position: 'relative', width: '468px', height: 150 }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          height: '150px',
          borderRadius: 4,
          bgcolor: 'var(--color-09)',
          color: 'var(--color-03)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
        }}
      >
        <CardContent
          sx={{
            overflowY: 'auto',
            maxHeight: '150px',
            pt: 1,
            pb: 1,
            pl: 2,
            pr: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {typeof content === 'string' ? (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {content}
            </Typography>
          ) : (
            <>
              <Typography variant="h6">
                {content?.emoji} {content?.title}
              </Typography>
              {content?.description && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {content.description}
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {paused && (
        <>
          <IconButton
            size="small"
            // onClick={() => prev(idx, idx === jIdx ? setJIdx : setEIdx, len)}
            onClick={() => {
              if (idx === jIdx) prev(idx, setJIdx, len);
              else if (idx === eIdx) prev(idx, setEIdx, len);
              else if (idx === fIdx) prev(idx, setFIdx, len);
            }}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 8,
              transform: 'translateY(-50%)',
              color: 'var(--color-02)',
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            // onClick={() => next(idx, idx === jIdx ? setJIdx : setEIdx, len)}
            onClick={() => {
              if (idx === jIdx) next(idx, setJIdx, len);
              else if (idx === eIdx) next(idx, setEIdx, len);
              else if (idx === fIdx) next(idx, setFIdx, len);
            }}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'rgba(0,0,0,0.6)',
              px: 1,
              borderRadius: 3,
            }}
          >
            <Typography variant="caption" color="common.white">
              {idx + 1}/{len}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Grid
      container
      width={500}
      spacing={1}
      justifyContent="center"
      sx={{
        background: 'var(--color-07)',
        padding: '16px',
        borderRadius: '20px',
        marginTop: '32px',
        boxShadow:
          '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          // height: '150px',
          borderRadius: 4,
          bgcolor: 'var(--color-09)',
          color: 'var(--color-02)',
          boxShadow:
            '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', display: 'block' }}>
          {today.format('DD MMMM YYYY')} • День {dayOfYear} • Неделя {today.week()}{' '}
        </Typography>
      </Box>
      <Grid item>
        {renderCard(
          jIdx === 0
            ? `Шутка дня #${dayOfYear}`
            : jIdx === 1
            ? `Шутка дня #${dayOfYear + 366}`
            : `Шутка дня #${randomIdx + 1}`,
          jokes[jIdx],
          'joke-card',
          jIdx,
          jokes.length,
          jPaused,
          setJPaused,
          setJIdx
        )}
      </Grid>
      <Grid item>
        {renderCard(`Событие дня`, events[eIdx], 'event-card', eIdx, events.length, ePaused, setEPaused, setEIdx)}
      </Grid>
      <Grid item>
        {renderCard(`Факты дня`, fact[fIdx], 'fact-card', fIdx, fact.length, fPaused, setFPaused, setFIdx)}
      </Grid>
      {/* <Box>
        <Card
          variant="outlined"
          sx={{
            width: '100%',
            // height: '150px',
            borderRadius: 4,
            bgcolor: 'var(--color-09)',
            color: 'var(--color-03)',
            boxShadow:
              '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom></Typography>
            <Typography variant="body2">{fact}</Typography>
          </CardContent>
        </Card>
      </Box> */}
    </Grid>
  );
};
