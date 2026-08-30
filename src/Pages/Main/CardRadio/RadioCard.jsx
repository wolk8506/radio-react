import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography, MenuItem, FormControl, Select, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import VolumeDownIcon from '@mui/icons-material/VolumeDown';
// import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
// import VolumeOffIcon from '@mui/icons-material/VolumeOff';
// import SensorsIcon from '@mui/icons-material/Sensors';

import { dataActions, rootSelectors } from 'store';
import { radioData } from './Radio-data';
import { useRadioNowPlaying } from './useRadioNowPlaying';
import { playStream, resumeStream, isCurrentStream } from './playStream';

const KEYFRAME_STYLES = `
  @keyframes ambientPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.06); }
  }
  @keyframes liveBlink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }
  @keyframes equalizerBar {
    0% { height: 15%; }
    50% { height: 95%; }
    100% { height: 15%; }
  }
`;

// Эквалайзер без фоновой подложки, со стильной полоской снизу
const CssEqualizer = ({ isPlaying, accentColor }) => {
  const bars = [
    { duration: '0.8s', delay: '0.0s' },
    { duration: '1.1s', delay: '0.2s' },
    { duration: '0.7s', delay: '0.4s' },
    { duration: '1.3s', delay: '0.1s' },
    { duration: '0.9s', delay: '0.3s' },
    { duration: '1.0s', delay: '0.5s' },
    { duration: '0.7s', delay: '0.2s' },
    { duration: '1.2s', delay: '0.4s' },
    { duration: '0.8s', delay: '0.1s' },
    { duration: '1.4s', delay: '0.3s' },
    { duration: '0.9s', delay: '0.5s' },
    { duration: '1.1s', delay: '0.0s' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        my: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          width: '100%',
          height: 32,
          gap: '4px',
          px: 0.5,
          pb: '6px',
        }}
      >
        {bars.map((bar, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              borderRadius: '3px',
              background: isPlaying
                ? `linear-gradient(180deg, ${accentColor} 0%, rgba(255,255,255,0.5) 100%)`
                : 'rgba(255, 255, 255, 0.15)',
              height: isPlaying ? '30%' : '15%',
              animation: isPlaying ? `equalizerBar ${bar.duration} ease-in-out infinite alternate` : 'none',
              animationDelay: bar.delay,
              transition: 'height 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </Box>

      {/* Стильная аккуратная полоска под эквалайзером */}
      <Box
        sx={{
          width: '100%',
          height: '2px',
          borderRadius: '2px',
          background: isPlaying
            ? `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`
            : 'rgba(255, 255, 255, 0.1)',
          transition: 'background 0.3s ease',
        }}
      />
    </Box>
  );
};

export const RadioCard = ({ onAudio }) => {
  const PLAYER_STATION = useSelector(rootSelectors.getPlayerStation);
  const dispatch = useDispatch();

  const [station, setStation] = useState(PLAYER_STATION ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState('00:00');
  // const [volume, setVolume] = useState(0.75);
  // const [isHoveredVolume, setIsHoveredVolume] = useState(false);
  // const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  const nowPlayingMap = useRadioNowPlaying();

  useEffect(() => {
    if (PLAYER_STATION !== undefined && PLAYER_STATION !== station) {
      setStation(PLAYER_STATION);
    }
  }, [PLAYER_STATION, station]);

  useEffect(() => {
    dispatch(dataActions.setPlayerPlay(isPlaying));
  }, [dispatch, isPlaying]);

  // useEffect(() => {
  //   if (onAudio) onAudio.volume = volume;
  // }, [onAudio, volume]);

  const playStation = useCallback(
    stationIndex => {
      if (!onAudio) return;
      const currentStation = radioData[stationIndex];
      if (currentStation) {
        playStream(onAudio, currentStation.url);
        setIsPlaying(true);
      }
    },
    [onAudio]
  );

  const handlePlayPause = useCallback(() => {
    if (!onAudio) return;

    if (isPlaying) {
      onAudio.pause();
      setIsPlaying(false);
    } else {
      if (!isCurrentStream(radioData[station]?.url)) {
        playStation(station);
      } else {
        resumeStream(onAudio, radioData[station]?.url);
        setIsPlaying(true);
      }
    }
  }, [onAudio, isPlaying, station, playStation]);

  const handleStationChange = e => {
    const newStationIndex = Number(e.target.value);
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
      setPlayTime(`${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`);
      setIsPlaying(!onAudio.paused);
    }, 500);
    return () => clearInterval(interval);
  }, [onAudio]);

  const currentStationData = radioData[station] || radioData[0];
  const np = nowPlayingMap?.[currentStationData?.id] || null;

  useEffect(() => {
    if (
      typeof navigator === 'undefined' ||
      !('mediaSession' in navigator) ||
      typeof window === 'undefined' ||
      !window.MediaMetadata
    ) {
      return;
    }
    const stationName = currentStationData?.name || 'Радио';
    const title = np?.track || np?.title || stationName;
    const artist = np?.artist || stationName;
    const cover = np?.cover || currentStationData?.logo;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title,
      artist,
      album: stationName,
      artwork: cover ? [{ src: cover, sizes: '512x512', type: 'image/jpeg' }] : [],
    });
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [np, currentStationData, isPlaying]);

  useEffect(() => {
    const styleId = 'radio-card-keyframes';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = KEYFRAME_STYLES;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const rawTrackInfo = np?.track || np?.title || '';
  let artistName = np?.artist || '';
  let songTitle = rawTrackInfo;

  if (!artistName && rawTrackInfo.includes('—')) {
    const parts = rawTrackInfo.split('—');
    artistName = parts[0].trim();
    songTitle = parts.slice(1).join('—').trim();
  } else if (!artistName && rawTrackInfo.includes('-')) {
    const parts = rawTrackInfo.split('-');
    artistName = parts[0].trim();
    songTitle = parts.slice(1).join('-').trim();
  }

  if (!artistName && !songTitle) {
    artistName = currentStationData?.name || 'Radio';
    songTitle = 'Прямой эфир';
  }

  const accent = currentStationData?.accentColor || '#a855f7';
  const glass = 'rgba(255,255,255,0.08)';
  const glassStrong = 'rgba(255,255,255,0.14)';
  const textMain = '#fff';
  const textMuted = 'rgba(255,255,255,0.55)';

  // Динамическая иконка уровня громкости
  // const renderVolumeIcon = () => {
  //   if (volume === 0) return <VolumeOffIcon fontSize="small" />;
  //   if (volume < 0.25) return <VolumeMuteIcon fontSize="small" />;
  //   if (volume < 0.65) return <VolumeDownIcon fontSize="small" />;
  //   return <VolumeUpIcon fontSize="small" />;
  // };

  // const isVolumeExpanded = isHoveredVolume || isDraggingVolume;

  return (
    <Box
      className="block"
      sx={{
        position: 'relative',
        width: '100%',
        p: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        height: 'auto',
        '@media (min-width: 601px)': {
          height: '236px',
          alignItems: 'flex-start',
          flexDirection: 'row',
        },
      }}
    >
      {/* 1. Обложка */}
      <Box
        sx={{
          position: 'relative',
          flexShrink: 0,
          width: 200,
          height: 200,
        }}
      >
        {isPlaying && (
          <Box
            sx={{
              position: 'absolute',
              inset: -16,
              borderRadius: '28px',
              background: `radial-gradient(ellipse at center, ${accent}40 0%, transparent 70%)`,
              filter: 'blur(24px)',
              zIndex: -1,
              animation: 'ambientPulse 3.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        <Box
          component="img"
          className="logoRadio"
          src={np?.cover ? np.cover : (currentStationData?.logo || null)}
          alt={currentStationData?.name || 'Radio logo'}
          onError={e => {
            if (currentStationData?.logo && e.currentTarget.src !== currentStationData.logo) {
              e.currentTarget.src = currentStationData.logo;
            }
          }}
          sx={{
            width: 200,
            height: 200,
            borderRadius: '20px',
            objectFit: 'cover',
            boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            zIndex: 1,
            display: 'block',
          }}
        />

        {np?.cover && (
          <Box
            component="img"
            src={currentStationData?.logo}
            alt=""
            sx={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              width: 40,
              height: 40,
              borderRadius: '10px',
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.7)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.55)',
              zIndex: 2,
              backdropFilter: 'blur(4px)',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
        )}
      </Box>

      {/* 2. Контентная часть — ровно 280px */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '280px',
          maxWidth: '280px',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <FormControl fullWidth size="small" className="selectRadioStation">
              <Select
                value={station}
                onChange={handleStationChange}
                sx={{
                  color: textMain,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${glassStrong}, ${glass})`,
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    minHeight: 32,
                  },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSvgIcon-root': { color: textMuted },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(22,26,36,0.98)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: textMain,
                      maxHeight: 220,
                      borderRadius: '14px',
                      mt: 1,
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
                      sx={{ width: 20, height: 20, borderRadius: '6px', mr: 1.5, objectFit: 'cover' }}
                    />
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Информация о треке */}
        <Box sx={{ mt: 1, width: '100%', overflow: 'hidden' }}>
          <Tooltip title={artistName} arrow placement="top-start">
            <Typography
              sx={{
                fontSize: '1.3rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
              }}
            >
              {artistName}
            </Typography>
          </Tooltip>

          <Tooltip title={songTitle} arrow placement="bottom-start">
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.6)',
                mt: 0.5,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
              }}
            >
              {songTitle}
            </Typography>
          </Tooltip>
        </Box>

        {/* Легкий CSS Эквалайзер с нижней полоской + Время */}
        <Box sx={{ width: '100%' }}>
          <CssEqualizer isPlaying={isPlaying} accentColor={accent} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: isPlaying ? accent : 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
              fontWeight: 600,
              textAlign: 'right',
              px: 0.5,
              mt: 0.5,
            }}
          >
            {playTime}
          </Typography>
        </Box>
      </Box>

      {/* 3. Управление */}
      <Box sx={{ m: 'auto' }}>
        {/* Индикатор LIVE / PAUSED */}
        {/* <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            height: 36,
            px: 1.2,
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            '@media (min-width: 601px)': {
              top: 10,
              right: 7,
            },
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isPlaying ? '#fff' : 'rgba(255,255,255,0.4)',
              animation: isPlaying ? 'liveBlink 1.2s ease-in-out infinite' : 'none',
            }}
          />
          {isPlaying ? (
            <SensorsIcon />
          ) : (
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isPlaying ? '#fff' : 'rgba(255,255,255,0.6)',
                fontFamily: 'monospace',
              }}
            >
              PAUSED
            </Typography>
          )}
        </Box> */}

        {/* Кнопка Play / Pause */}
        <IconButton
          className="btn"
          onClick={handlePlayPause}
          sx={{
            width: 70,
            height: 70,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${accent} 0%, #7e22ce 100%)`,
            color: '#fff',
            boxShadow: isPlaying ? `0 0 24px ${accent}80, 0 8px 20px rgba(0,0,0,0.4)` : `0 8px 20px ${accent}35`,
            transition: 'all 0.3s cubic-bezier(0.2,0,0.2,1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          {isPlaying ? <PauseIcon sx={{ fontSize: '2rem' }} /> : <PlayArrowIcon sx={{ fontSize: '2rem', ml: '2px' }} />}
        </IconButton>

        {/* Регулятор громкости */}
        
      </Box>
    </Box>
  );
};
