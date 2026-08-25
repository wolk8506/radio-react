import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
// import { Box, Typography } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const Clock = () => {
  const [hh, setHh] = useState('00');
  const [mm, setMm] = useState('00');
  const [ss, setSs] = useState('00');
  const [hh2, setHh2] = useState('00');
  const [mm2, setMm2] = useState('00');
  const [ss2, setSs2] = useState('00');

  const [changeSecond, setChangeSecond] = useState(true);
  const [changeMinute, setChangeMinute] = useState(true);
  const [changeHour, setChangeHour] = useState(true);

  const setClock = () => {
    let day = new Date();

    const clockNull = i => {
      if (String(i).length < 2) {
        return '0' + i;
      } else return i;
    };

    setHh(clockNull(day.getHours()));
    setMm(clockNull(day.getMinutes()));
    setSs(clockNull(day.getSeconds()));

    setChangeHour(false);
    setChangeMinute(false);
    setChangeSecond(false);
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    const interval = setInterval(() => {
      setClock();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setChangeSecond(true);
    const interval = setInterval(() => {
      setSs2(ss);
    }, 500);

    return () => clearInterval(interval);
  }, [ss]);

  useEffect(() => {
    setChangeMinute(true);
    const interval = setInterval(() => {
      setMm2(mm);
    }, 500);

    return () => clearInterval(interval);
  }, [mm]);

  useEffect(() => {
    setChangeHour(true);
    const interval = setInterval(() => {
      setHh2(hh);
    }, 500);

    return () => clearInterval(interval);
  }, [hh]);

  return (
    <Box
      className="card-main-page"
      sx={{
        width: '100%',
        height: '236px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 0,
        '@media (max-width: 768px)': { height: 'auto', minHeight: 'auto' },
      }}
    >
      {/* Шапка карточки (как в TimeHero) */}
      {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', px: 2, pt: 2 }}>
        <AccessTimeIcon sx={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)' }} />
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          Система времени
        </Typography>
      </Box> */}

      {/* Flip-часы, вписанные в размер карточки */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
        }}
      >
        <div className="wrapper">
          <div className="clock-hero-scaler">
            <div className="clock clock--hero">
              <div className="flipper">
              <div className="gear"></div>
              <div className="gear"></div>
              <div className="top">
                <div className="text">{hh}</div>
              </div>
              {changeHour && (
                <div className="top_new">
                  <div className="text_top_new">{hh2}</div>
                  <div className="bottom_new">
                    <div className="text_bottom">{hh}</div>
                  </div>
                </div>
              )}
              <div className="bottom">
                <div className="text_bottom">{hh2}</div>
              </div>
            </div>

            <div className="flipper">
              <div className="gear"></div>
              <div className="gear"></div>
              <div className="top">
                <div className="text">{mm}</div>
              </div>
              {changeMinute && (
                <div className="top_new">
                  <div className="text_top_new">{mm2}</div>
                  <div className="bottom_new">
                    <div className="text_bottom">{mm}</div>
                  </div>
                </div>
              )}
              <div className="bottom">
                <div className="text_bottom">{mm2}</div>
              </div>
            </div>

            <div className="flipper">
              <div className="gear"></div>
              <div className="gear"></div>
              <div className="top">
                <div className="text">{ss}</div>
              </div>
              {changeSecond && (
                <div className="top_new">
                  <div className="text_top_new">{ss2}</div>
                  <div className="bottom_new">
                    <div className="text_bottom">{ss}</div>
                  </div>
                </div>
              )}
              <div className="bottom">
                <div className="text_bottom">{ss2}</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};
