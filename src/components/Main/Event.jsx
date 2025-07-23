// import * as React from 'react';
// import { useEffect, useState } from 'react';

// import eventsJSON from './data/events.json';
// import anecdoteJSON from './data/anecdote.json';
// import 'dayjs/locale/ru';

// export const Event = () => {
//   let moment = require('moment');
//   let currentDayEvent = moment().format('MM-DD');
//   const events = eventsJSON;
//   const [event, setEvent] = useState(['Сегодня событий нет']);
//   const [fact, setFact] = useState([]);
//   const [joke, setJoke] = useState([]);

//   useEffect(() => {
//     if (anecdoteJSON[0].joke[0]) {
//       setJoke(anecdoteJSON[moment().dayOfYear()].joke);
//     } else {
//       setJoke(false);
//     }
//   }, [currentDayEvent, events, moment]);

//   useEffect(() => {
//     if (events[currentDayEvent].fact) {
//       setFact(events[currentDayEvent].fact);
//     } else {
//       setFact(false);
//     }
//   }, [currentDayEvent, events]);

//   useEffect(() => {
//     if (events[currentDayEvent].event) {
//       setEvent(events[currentDayEvent].event);
//     } else {
//       setEvent(['Сегодня событий нет']);
//     }
//   }, [currentDayEvent, events]);

//   return (
//     <section className="graph">
//       <h1>Шутка / Факт / События</h1>
//       <div>
//         <ul className="days">
//           {joke &&
//             joke.map(i => (
//               <li className="event-item" key={i}>
//                 Шутка дня:
//                 <br /> <span>{i}</span>
//               </li>
//             ))}
//           {fact &&
//             fact.map(i => (
//               <li className="event-item" key={i}>
//                 Факт дня:
//                 <br /> <span>{i}</span>
//               </li>
//             ))}
//           <li className="event-item" key="sdfasdf">
//             События дня:
//             <ul>
//               {event.map(({ title, description, emoji }) => (
//                 <li className="event-item event-item--event" key={title}>
//                   <strong>
//                     {emoji} {title}
//                   </strong>
//                   {description && <p className="event-description">{description}</p>}
//                 </li>
//               ))}
//             </ul>
//           </li>
//         </ul>
//       </div>
//     </section>
//   );
// };

//------------------------
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

  // события

  // факт
  const key = today.format('MM-DD');
  const [fact, setFact] = useState('Факт недоступен');
  useEffect(() => {
    const f = eventsJSON[key]?.fact;
    setFact(f && f.length ? f[0] : 'Фактов на сегодня нет');
  }, [key]);

  const [jIdx, setJIdx] = useState(0);
  const [eIdx, setEIdx] = useState(0);
  const [jPaused, setJPaused] = useState(false);
  const [ePaused, setEPaused] = useState(false);

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
                {content.emoji} {content.title}
              </Typography>
              {content.description && (
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
            onClick={() => prev(idx, idx === jIdx ? setJIdx : setEIdx, len)}
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
            onClick={() => next(idx, idx === jIdx ? setJIdx : setEIdx, len)}
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
      <Box>
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
      </Box>
    </Grid>
  );
};

// --------------------------------------------------------------------

// import React, { useState, useEffect, useMemo } from 'react';
// import moment from 'moment';
// import 'moment/locale/ru';
// import { Box, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
// import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

// import anecdoteData from './data/anecdote.json';
// import eventsJSON from './data/events.json';

// export const Event = () => {
//   moment.locale('ru');
//   const today = moment();
//   const dayOfYear = today.dayOfYear(); // 1…365/366
//   const idx1 = dayOfYear - 1; // шутка дня
//   const idx2 = (idx1 + 366) % anecdoteData.length; // шутка +366
//   const randomIdx = useMemo(() => Math.floor(Math.random() * anecdoteData.length), []);

//   // шутки
//   const jokes = [
//     anecdoteData[idx1]?.joke[0] ?? 'Шутка недоступна',
//     anecdoteData[idx2]?.joke[0] ?? 'Шутка недоступна',
//     anecdoteData[randomIdx]?.joke[0] ?? 'Шутка недоступна',
//   ];

//   // события
//   const key = today.format('MM-DD');
//   const todayEvents = eventsJSON[key]?.event || [];
//   const events = todayEvents.length ? todayEvents : [{ title: 'Событий нет', description: '', emoji: '' }];

//   // факт
//   const [fact, setFact] = useState('Факт недоступен');
//   useEffect(() => {
//     const f = eventsJSON[key]?.fact;
//     setFact(f && f.length ? f[0] : 'Фактов на сегодня нет');
//   }, [key]);

//   // слайдер
//   const slides = ['jokes', 'events'];
//   const [slideIdx, setSlideIdx] = useState(0);
//   const [paused, setPaused] = useState(false);

//   useEffect(() => {
//     if (paused) return;
//     const timer = setInterval(() => {
//       setSlideIdx(i => (i + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(timer);
//   }, [paused]);

//   const prev = () => setSlideIdx(i => (i + slides.length - 1) % slides.length);
//   const next = () => setSlideIdx(i => (i + 1) % slides.length);

//   return (
//     <Grid container justifyContent="center" sx={{ p: 2 }}>
//       <Box
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//         sx={{
//           position: 'relative',
//           width: 500,
//           height: 300,
//         }}
//       >
//         {/* СЛАЙД С ШУТКАМИ */}
//         {slideIdx === 0 && (
//           <Card
//             variant="outlined"
//             sx={{
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between',
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 {`Шутка дня #${dayOfYear}`}
//               </Typography>
//               <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
//                 {jokes[0]}
//               </Typography>
//             </CardContent>
//             <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
//               <Typography variant="caption" color="text.secondary">
//                 {today.format('DD MMMM YYYY')} • День {dayOfYear} • Неделя {today.week()}
//               </Typography>
//             </Box>
//           </Card>
//         )}

//         {/* СЛАЙД СО СЛУЧАЙНОЙ ШУТКОЙ +366 */}
//         {slideIdx === 1 && (
//           <Card
//             variant="outlined"
//             sx={{
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between',
//             }}
//           >
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 {`Шутка дня #${dayOfYear + 366}`}
//               </Typography>
//               <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
//                 {jokes[1]}
//               </Typography>
//             </CardContent>
//             <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
//               <Typography variant="caption" color="text.secondary">
//                 {today.format('DD MMMM YYYY')} • День {dayOfYear} • Неделя {today.week()}
//               </Typography>
//             </Box>
//           </Card>
//         )}

//         {/* Навигация и индикатор */}
//         {paused && (
//           <>
//             <IconButton
//               size="small"
//               onClick={prev}
//               sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: 8,
//                 transform: 'translateY(-50%)',
//               }}
//             >
//               <ArrowBackIos fontSize="small" />
//             </IconButton>
//             <IconButton
//               size="small"
//               onClick={next}
//               sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 right: 8,
//                 transform: 'translateY(-50%)',
//               }}
//             >
//               <ArrowForwardIos fontSize="small" />
//             </IconButton>
//             <Box
//               sx={{
//                 position: 'absolute',
//                 bottom: 8,
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 bgcolor: 'rgba(0,0,0,0.6)',
//                 px: 1,
//                 borderRadius: 1,
//               }}
//             >
//               <Typography variant="caption" color="common.white">
//                 {slideIdx + 1}/{slides.length}
//               </Typography>
//             </Box>
//           </>
//         )}
//       </Box>

//       {/* ФАКТ */}
//       <Box sx={{ mt: 2, width: 500 }}>
//         <Card variant="outlined">
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Факт дня
//             </Typography>
//             <Typography variant="body2">{fact}</Typography>
//           </CardContent>
//         </Card>
//       </Box>
//     </Grid>
//   );
// };
