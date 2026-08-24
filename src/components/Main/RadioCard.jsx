import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography, MenuItem, FormControl, Select, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

import { dataActions, rootSelectors } from 'store';
import { radioData } from './Radio-data';

export const RadioCard = ({ onAudio }) => {
  const PLAYER_STATION = useSelector(rootSelectors.getPlayerStation);
  const dispatch = useDispatch();

  const [station, setStation] = useState(PLAYER_STATION ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState('00:00');

  useEffect(() => {
    if (PLAYER_STATION !== undefined && PLAYER_STATION !== station) {
      setStation(PLAYER_STATION);
    }
  }, [PLAYER_STATION]);

  useEffect(() => {
    dispatch(dataActions.setPlayerPlay(isPlaying));
  }, [dispatch, isPlaying]);

  const playStation = useCallback(
    stationIndex => {
      if (!onAudio) return;

      const currentStation = radioData[stationIndex];
      if (currentStation) {
        onAudio.pause();
        onAudio.src = currentStation.url;
        onAudio
          .play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error('Audio playback error:', err);
            setIsPlaying(false);
          });
      }
    },
    [onAudio]
  );

  const handlePlayPause = () => {
    if (!onAudio) return;

    if (isPlaying) {
      onAudio.pause();
      setIsPlaying(false);
    } else {
      if (!onAudio.src || onAudio.src !== radioData[station]?.url) {
        playStation(station);
      } else {
        onAudio
          .play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error('Audio play error:', err));
      }
    }
  };

  const handleStationChange = e => {
    const newStationIndex = e.target.value;
    setStation(newStationIndex);
    dispatch(dataActions.setPlayerStation(newStationIndex));
    playStation(newStationIndex);
  };

  useEffect(() => {
    if (!onAudio) return;

    const interval = setInterval(() => {
      const currentTime = onAudio.currentTime || 0;
      const m = Math.floor(currentTime / 60);
      const s = Math.floor(currentTime % 60);

      const formattedTime = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
      setPlayTime(formattedTime);
      setIsPlaying(!onAudio.paused);
    }, 500);

    return () => clearInterval(interval);
  }, [onAudio]);

  const currentStationData = radioData[station] || radioData[0];

  return (
    <Box
      className="col-6 row-span-5 maim-player card-main-page"
      sx={{
        height: '236px',
        
        flexDirection: 'row !important',
        // borderRadius: '22px',
        // padding: '20px 24px',
        // display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        // gap: '20px',
        // overflow: 'hidden',
        // position: 'relative',
        // background: 'rgba(30, 35, 45, 0.45)',
        // backdropFilter: 'blur(40px) saturate(210%)',
        // WebkitBackdropFilter: 'blur(40px) saturate(210%)',
        // border: '1px solid rgba(255, 255, 255, 0.18)',
        // boxShadow:
        //   '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
      }}
    >
      {/* 1. Увеличенный обложка / логотип радиостанции */}
      <Box
        sx={{
          position: 'relative',
          flexShrink: 0,
          '&::after': isPlaying
            ? {
                content: '""',
                position: 'absolute',
                inset: -4,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6), transparent)',
                filter: 'blur(8px)',
                zIndex: 0,
              }
            : {},
        }}
      >
        <Box
          component="img"
          className="logoRadio"
          src={currentStationData?.logo}
          alt={currentStationData?.name || 'Radio logo'}
          sx={{
            width: 160,
            height: 160,
            borderRadius: '20px',
            objectFit: 'cover',
            boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            zIndex: 1,
            display: 'block',
          }}
        />
      </Box>

      {/* 2. Выравнивание таймера и селекта радио по центру */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px',
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {/* Индикатор времени с акцентной плашкой */}
        <Box className="maim-player__clock-block" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '6px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Typography
              className="clock-block__clock"
              sx={{
                width: '100px',
                fontSize: '1.65rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: isPlaying ? '#a855f7' : '#ffffff',
                letterSpacing: '0.08em',
                transition: 'color 0.3s',
                lineHeight: 1,
              }}
            >
              {playTime}
            </Typography>
          </Box>
        </Box>

        {/* Выпадающий список станций */}
        <FormControl fullWidth size="small" className="selectRadioStation">
          <Select
            // className="list"
            value={station}
            onChange={handleStationChange}
            sx={{
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                padding: '10px 14px',
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: 'rgba(25, 30, 40, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  maxHeight: 220,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.85rem',
                    padding: '8px 12px',
                    '&:hover': { background: 'rgba(168, 85, 247, 0.2)' },
                    '&.Mui-selected': { background: 'rgba(168, 85, 247, 0.35)' },
                  },
                },
              },
            }}
          >
            {radioData.map((item, index) => (
              <MenuItem key={index} value={index}>
                <Box
                  component="img"
                  src={item.logo}
                  alt={item.name}
                  sx={{ width: 28, height: 28, borderRadius: '6px', mr: 1.5, objectFit: 'cover' }}
                />
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 3. Увеличенная кнопка воспроизведения */}
      <IconButton
        className="btn"
        onClick={handlePlayPause}
        sx={{
          width: 64,
          height: 64,
          flexShrink: 0,
          background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
          color: '#fff',
          borderRadius: '20px',
          boxShadow: isPlaying
            ? '0 0 24px rgba(168, 85, 247, 0.6), 0 8px 20px rgba(0,0,0,0.4)'
            : '0 8px 20px rgba(168, 85, 247, 0.35)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)',
            transform: 'scale(1.06)',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        {isPlaying ? (
          <PauseIcon className="btn__icon" sx={{ fontSize: '2.4rem' }} />
        ) : (
          <PlayArrowIcon className="btn__icon" sx={{ fontSize: '2.4rem', ml: '2px' }} />
        )}
      </IconButton>
    </Box>
  );
};
