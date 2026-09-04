import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography, MenuItem, FormControl, Select, IconButton, Tooltip, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
// import PodcastsIcon from '@mui/icons-material/Podcasts';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

import { dataActions, rootSelectors } from 'store';
import { radioData } from './Radio-data';
import { useRadioNowPlaying } from './useRadioNowPlaying';
import { useRadioHistory } from './useRadioHistory';
import { playStream, resumeStream, isCurrentStream } from './playStream';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const KEYFRAMES = `
  @keyframes ambientPulse { 0%,100% { opacity:0.32; transform:scale(1)} 50%{opacity:0.75; transform:scale(1.05)} }
  @keyframes livePulse { 0%,100% { opacity:1; transform:scale(1)} 50%{opacity:0.35; transform:scale(0.8)} }
  @keyframes equalizerBar { 0%{height:15%} 50%{height:95%} 100%{height:15%} }
  @keyframes coverRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;

const CssEqualizer = ({ isPlaying, accentColor }) => {
  const bars = [
    { duration: '0.8s', delay: '0.0s' }, { duration: '1.1s', delay: '0.2s' },
    { duration: '0.7s', delay: '0.4s' }, { duration: '1.3s', delay: '0.1s' },
    { duration: '0.9s', delay: '0.3s' }, { duration: '1.0s', delay: '0.5s' },
    { duration: '0.7s', delay: '0.2s' }, { duration: '1.2s', delay: '0.4s' },
    { duration: '0.8s', delay: '0.1s' }, { duration: '1.4s', delay: '0.3s' },
    { duration: '0.9s', delay: '0.5s' }, { duration: '1.1s', delay: '0.0s' },
  ];
  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', height: 32, gap: '4px', px: 0.5, pb: '6px' }}>
        {bars.map((bar, i) => (
          <Box key={i} sx={{
            flex: 1, borderRadius: '3px',
            background: isPlaying ? `linear-gradient(180deg, ${accentColor} 0%, rgba(255,255,255,0.5) 100%)` : 'rgba(255,255,255,0.15)',
            height: isPlaying ? '30%' : '15%',
            animation: isPlaying ? `equalizerBar ${bar.duration} ease-in-out infinite alternate` : 'none',
            animationDelay: bar.delay, transition: 'height 0.3s ease, background 0.3s ease',
          }} />
        ))}
      </Box>
      <Box sx={{ width: '100%', height: '2px', borderRadius: '2px', background: isPlaying ? `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)` : 'rgba(255,255,255,0.1)', transition: 'background 0.3s ease' }} />
    </Box>
  );
};

const StationCarousel = ({ stations, current, onSelect, accent, onClose }) => {
  const [swiper, setSwiper] = useState(null);

  // всегда открываться на текущей станции
  useEffect(() => {
    if (swiper && typeof current === 'number') {
      // без loop — обычный slideTo, с loop — slideToLoop
      if (swiper.params.loop) swiper.slideToLoop(current, 0, false);
      else swiper.slideTo(current, 0, false);
      // на следующий тик анимированно для красоты
      requestAnimationFrame(() => {
        if (swiper.destroyed) return;
        if (swiper.params.loop) swiper.slideToLoop(current, 350, false);
        else swiper.slideTo(current, 350, false);
      });
    }
  }, [current, swiper]);

  return (
    <Box sx={{
      position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      // background: `radial-gradient(600px 300px at 50% 30%, ${accent}14 0%, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, pt: 0.5, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 26, height: 26, borderRadius: '7px', background: `${accent}18`, border: `1px solid ${accent}28`, display: 'grid', placeItems: 'center' }}>
            <ViewCarouselIcon sx={{ fontSize: 14, color: accent }} />
          </Box>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Выбор станции</Typography>
          <Typography sx={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.45)', ml: 0.5 }}>{stations.length} станций • свайп / скролл / колесо</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ width: 30, height: 30, bgcolor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' } }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', py: 1, px: 0.5,
        '& .swiper': { width: '100%', padding: '12px 0 18px', overflow: 'visible' },
        '& .swiper-wrapper': { alignItems: 'center' },
        '& .swiper-slide': { width: 148, height: 148, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.4s ease', border: '1px solid rgba(255,255,255,0.08)', background: '#0b0e14', boxShadow: '0 6px 18px rgba(0,0,0,0.35)', flexShrink: 0, pointerEvents: 'auto' },
        '& .swiper-slide-active': { transform: 'scale(1.08)', borderColor: `${accent}55`, boxShadow: `0 10px 28px rgba(0,0,0,0.5), 0 0 0 2px ${accent}30`, zIndex: 2 },
        '& .swiper-slide-prev, & .swiper-slide-next': { opacity: 0.72, transform: 'scale(0.88) translateY(6px)', filter: 'blur(0.3px)' },
        '& .swiper-button-prev, & .swiper-button-next': { color: '#fff', width: 28, height: 28,  '&:after': { fontSize: '12px', fontWeight: 800 } },
      }}>
        <Swiper
          onSwiper={setSwiper}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          spaceBetween={14}
          watchSlidesProgress
          observer
          observeParents
          watchOverflow
          centerInsufficientSlides
          slidesOffsetBefore={20}
          slidesOffsetAfter={20}
          slideToClickedSlide
          mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: false }}
          keyboard={{ enabled: true }}
          freeMode={false}
          preventClicks={false}
          preventClicksPropagation={false}
          threshold={5}
          initialSlide={current}
          coverflowEffect={{ rotate: 18, stretch: 0, depth: 140, modifier: 1.1, slideShadows: false }}
          modules={[EffectCoverflow, Navigation, Mousewheel]}
          navigation
        >
          {stations.map((s, idx) => {
            const isActive = idx === current;
            return (
              <SwiperSlide key={s.id} onClick={() => onSelect(idx)}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Box component="img" src={s.logo} alt={s.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ position: 'absolute', inset: 0, background: isActive ? 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.72) 100%)' : 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55) 100%)' }} />
                  <Box sx={{ position: 'absolute', top: 7, left: 7, px: 0.75, py: 0.2, borderRadius: '100px', bgcolor: isActive ? accent : 'rgba(0,0,0,0.55)',  fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.14)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </Box>
                  {isActive && (
                    <Box sx={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', bgcolor: '#22c55e', boxShadow: '0 0 8px #22c55e', border: '2px solid #fff' }} />
                  )}
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1, textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, lineHeight: 1.1, textShadow: '0 1px 6px rgba(0,0,0,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</Typography>
                    {/* <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isActive ? 'Нажмите для воспроизведения' : '•'}</Typography> */}
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: '0.62rem', color: 'rgba(255,255,255,0.38)', pb: 0.5, letterSpacing: '0.04em' }}>
        Скролл / свайп / колесо для промотки • Клик по обложке — играть
      </Typography>
    </Box>
  );
};

export const RadioCard = ({ onAudio }) => {
  const PLAYER_STATION = useSelector(rootSelectors.getPlayerStation);
  const dispatch = useDispatch();
  const [station, setStation] = useState(PLAYER_STATION ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState('00:00');
  const [showHistory, setShowHistory] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const nowPlayingMap = useRadioNowPlaying();
  const currentStationData = radioData[station] || radioData[0];
  const { history, loading: historyLoading } = useRadioHistory(currentStationData?.id, showHistory);

  useEffect(() => { if (PLAYER_STATION !== undefined && PLAYER_STATION !== station) setStation(PLAYER_STATION); }, [PLAYER_STATION, station]);
  useEffect(() => { dispatch(dataActions.setPlayerPlay(isPlaying)); }, [dispatch, isPlaying]);

  const playStation = useCallback(idx => {
    if (!onAudio) return;
    const s = radioData[idx];
    if (s) { playStream(onAudio, s.url); setIsPlaying(true); }
  }, [onAudio]);

  const handlePlayPause = useCallback(() => {
    if (!onAudio) return;
    if (isPlaying) { onAudio.pause(); setIsPlaying(false); }
    else {
      if (!isCurrentStream(radioData[station]?.url)) playStation(station);
      else { resumeStream(onAudio, radioData[station]?.url); setIsPlaying(true); }
    }
  }, [onAudio, isPlaying, station, playStation]);

  const handleStationChange = e => {
    const idx = Number(e.target.value);
    setStation(idx); dispatch(dataActions.setPlayerStation(idx)); playStation(idx);
  };

  const handleSelectStation = (idx) => {
    setStation(idx); dispatch(dataActions.setPlayerStation(idx)); playStation(idx);
    setShowCarousel(false);
  };

  useEffect(() => {
    if (!onAudio) return;
    const id = setInterval(() => {
      const t = onAudio.currentTime || 0;
      const m = Math.floor(t / 60), s = Math.floor(t % 60);
      setPlayTime(`${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`);
      setIsPlaying(!onAudio.paused);
    }, 500);
    return () => clearInterval(id);
  }, [onAudio]);

  const np = nowPlayingMap?.[currentStationData?.id] || null;
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !window.MediaMetadata) return;
    const name = currentStationData?.name || 'Радио';
    const title = np?.track || np?.title || name;
    const artist = np?.artist || name;
    const cover = np?.cover || currentStationData?.logo;
    navigator.mediaSession.metadata = new window.MediaMetadata({ title, artist, album: name, artwork: cover ? [{ src: cover, sizes: '512x512', type: 'image/jpeg' }] : [] });
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [np, currentStationData, isPlaying]);

  useEffect(() => {
    const id = 'radio-card-keyframes-v2';
    if (document.getElementById(id)) return;
    const s = document.createElement('style'); s.id = id; s.textContent = KEYFRAMES; document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  let artistName = np?.artist || '';
  let songTitle = np?.track || np?.title || '';
  if (!artistName && songTitle.includes('—')) { const p = songTitle.split('—'); artistName = p[0].trim(); songTitle = p.slice(1).join('—').trim(); }
  else if (!artistName && songTitle.includes('-')) { const p = songTitle.split('-'); artistName = p[0].trim(); songTitle = p.slice(1).join('-').trim(); }
  if (!artistName && !songTitle) { artistName = currentStationData?.name || 'Radio'; songTitle = 'Прямой эфир'; }

  const accent = currentStationData?.accentColor || '#a855f7';
  const glass = 'rgba(255,255,255,0.07)';
  const glassStrong = 'rgba(255,255,255,0.13)';
  const textMain = 'var(--color-02)';
  // const textMain = '#fff';
  const textMuted = 'rgba(255,255,255,0.58)';
  const textDim = 'rgba(255,255,255,0.38)';

  const formatTime = ts => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderHistory = () => (
    <Box className="block" sx={{
      position: 'relative', width: '100%', p: '14px 16px 14px 20px',
      display: 'flex', flexDirection: 'column', gap: 0,
      height: 'auto', '@media (min-width: 601px)': { height: '236px' },
      overflow: 'hidden',
      background: `radial-gradient(600px 300px at 15% 50%, ${accent}18 0%, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, mb: 1, borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: `${accent}22`, border: `1px solid ${accent}30`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <HistoryIcon sx={{ fontSize: 16, color: accent }} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: textMain, lineHeight: 1, letterSpacing: '-0.02em' }}>{currentStationData?.name}</Typography>
          <Typography sx={{ fontSize: '0.68rem', color: textMuted, lineHeight: 1.2 }}>История за час • {history.length} треков</Typography>
        </Box>
        <Tooltip title="Закрыть" arrow>
          <IconButton size="small" onClick={() => setShowHistory(false)} sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: textMuted, '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', color: textMain } }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{
        flex: 1, overflow: 'auto', pr: 0.5, mr: -0.5,
        '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.12)', borderRadius: 2 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
      }}>
        {historyLoading ? (
          <Box sx={{ py: 6, display: 'grid', placeItems: 'center', gap: 1.5, color: textMuted }}>
            <Box sx={{ width: 22, height: 22, border: '2px solid rgba(255,255,255,0.12)', borderTopColor: accent, borderRadius: '50%', animation: 'coverRotate 0.8s linear infinite' }} />
            <Typography sx={{ fontSize: '0.75rem' }}>Загрузка истории…</Typography>
          </Box>
        ) : history.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center', color: textMuted }}>
            <GraphicEqIcon sx={{ fontSize: 28, opacity: 0.4, mb: 1 }} />
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>Пока пусто</Typography>
            <Typography sx={{ fontSize: '0.7rem', opacity: 0.7 }}>Треки появятся после смены песни</Typography>
          </Box>
        ) : (
          <List disablePadding dense sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {history.slice().reverse().map((item, idx, arr) => {
              const isLive = idx === arr.length - 1;
              return (
                <ListItem key={`${item.playedAt}-${idx}`} sx={{
                  p: '6px 8px', borderRadius: '10px',
                  background: isLive ? `linear-gradient(90deg, ${accent}14, transparent)` : 'transparent',
                  border: isLive ? `1px solid ${accent}22` : '1px solid transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.07)' },
                  transition: 'all 0.2s',
                }}>
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Box sx={{ position: 'relative', width: 36, height: 36 }}>
                      <Avatar src={item.cover || currentStationData?.logo} alt={item.track} sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }} variant="rounded" />
                      {isLive && <Box sx={{ position: 'absolute', right: -2, top: -2, width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', border: '2px solid #0f172a', boxShadow: `0 0 8px #22c55e` }} />}
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ color: isLive ? '#fff' : textMain, fontWeight: isLive ? 700 : 600, fontSize: '0.78rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} noWrap>{item.artist || '—'}</Typography>}
                    secondary={<Typography sx={{ color: isLive ? 'rgba(255,255,255,0.72)' : textMuted, fontSize: '0.7rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} noWrap>{item.track || item.title || 'Неизвестный трек'}</Typography>}
                    sx={{ my: 0, minWidth: 0 }}
                  />
                  <Box sx={{ ml: 1, textAlign: 'right', flexShrink: 0, minWidth: 48 }}>
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: isLive ? accent : textDim, fontFamily: 'monospace' }}>{formatTime(item.playedAt)}</Typography>
                    {isLive && <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: '#22c55e', letterSpacing: '0.06em', lineHeight: 1 }}>LIVE</Typography>}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );

  if (showHistory) return renderHistory();
  if (showCarousel) {
    return (
      <Box className="block" sx={{
        position: 'relative', width: '100%', p: '12px 12px 10px',
        display: 'flex', flexDirection: 'column',
        height: 'auto', '@media (min-width: 601px)': { height: '236px' },
        overflow: 'hidden',
      }}>
        <StationCarousel stations={radioData} current={station} onSelect={handleSelectStation} accent={accent} onClose={() => setShowCarousel(false)} />
      </Box>
    );
  }

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
        overflow: 'hidden',
        '@media (min-width: 601px)': { height: '236px', alignItems: 'stretch', flexDirection: 'row' },
        background: `radial-gradient(520px 280px at 12% 50%, ${accent}16 0%, transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))`,
        border: '1px solid rgba(255,255,255,0.09)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          background: `linear-gradient(135deg, ${accent}18, transparent 45%, rgba(255,255,255,0.08))`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 1,
          flexGrow: 0,
          width: 'clamp(140px, 42vw, 200px)',
          height: 'clamp(140px, 42vw, 200px)',
          maxWidth: 200,
          maxHeight: 200,
          minWidth: 0,
          minHeight: 0,
          aspectRatio: '1 / 1',
          alignSelf: 'center',
          '@media (min-width: 601px)': { alignSelf: 'stretch' },
        }}
      >
        {isPlaying && (
          <Box
            sx={{
              position: 'absolute',
              inset: -14,
              borderRadius: '24px',
              background: `radial-gradient(ellipse at center, ${accent}32 0%, transparent 68%)`,
              filter: 'blur(18px)',
              animation: 'ambientPulse 3.2s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
        <Box
          sx={{
            position: 'relative',
            // width: 200,
            // height: 200,
            borderRadius: '18px',
            overflow: 'hidden',
            background: '#0b0e14',
            boxShadow: '0 14px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <Box
            component="img"
            src={np?.cover ? np.cover : currentStationData?.logo || null}
            alt={currentStationData?.name || 'Radio'}
            onError={e => {
              if (currentStationData?.logo && e.currentTarget.src !== currentStationData.logo)
                e.currentTarget.src = currentStationData.logo;
            }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: isPlaying ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.6s ease',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.55) 100%)',
              pointerEvents: 'none',
            }}
          />

          {np?.cover && (
          <Box
            component="img"
            src={currentStationData?.logo}
            alt=""
            sx={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              width: 38,
              height: 38,
              borderRadius: '10px',
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.85)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
              bgcolor: 'rgba(255,255,255,0.9)',
            }}
          />
        )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          '@media (max-width: 600px)': { width: '100%' },
          // width: '280px',
          // maxWidth: '220px',
          // minWidth:'280px',
          flexGrow: 1,
          flexShrink: 0,
          minWidth: 0,
          py: 0.25,
          pr: 1,
        }}
      >
        <FormControl fullWidth size="small" className="selectRadioStation">
          <Select
            value={station}
            onChange={handleStationChange}
            sx={{
              '@media (max-width: 600px)': { alignItems: 'center' },
              width: '165px',
              height: 24,
              color: textMain,
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              background: `linear-gradient(180deg, ${glassStrong}, ${glass})`,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              '& .MuiSelect-select': { display: 'flex', alignItems: 'center', py: '7px', px: '12px', minHeight: 34 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSvgIcon-root': { color: textMuted },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: 'rgba(14,16,22,0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: textMain,
                  maxHeight: 240,
                  borderRadius: '12px',
                  mt: 1,
                },
              },
            }}
          >
            {radioData.map((item, index) => (
              <MenuItem key={index} value={index} sx={{ fontSize: '0.82rem', py: 0.9 }}>
                <Box
                  component="img"
                  src={item.logo}
                  alt={item.name}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '6px',
                    mr: 1.25,
                    objectFit: 'cover',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <Box
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: index === station ? 700 : 500,
                  }}
                >
                  {item.name}
                </Box>
                {/* {index === station && isPlaying && (
                  <Box
                    sx={{
                      ml: 'auto',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#22c55e',
                      boxShadow: '0 0 6px #22c55e',
                    }}
                  />
                )} */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 1.1, minWidth: 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.6, '@media (max-width: 600px)': { mb: 2 } }}
          >
            <GraphicEqIcon sx={{ fontSize: 14, color: isPlaying ? accent : textDim }} />
            <Typography
              sx={{
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: isPlaying ? accent : textDim,
                textTransform: 'uppercase',
              }}
            >
              Сейчас играет
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: 1,
                background: `linear-gradient(90deg, ${accent}22, transparent)`,
                ml: 1,
                display: isPlaying ? 'block' : 'none',
              }}
            />
          </Box>
          <Tooltip title={artistName} arrow placement="top-start">
            <Typography
              sx={{
                fontSize: '1.22rem',
                fontWeight: 800,
                // maxWidth: 250,
                // marginRight:'auto',
                overflowWrap: 'break-word',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                // whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: textMain,
                background: isPlaying ? `linear-gradient(90deg, #fff 30%, ${accent}FF 100%)` : 'none',
                WebkitBackgroundClip: isPlaying ? 'text' : 'unset',
                WebkitTextFillColor: isPlaying ? 'transparent' : '#fff',
                '@media (max-width: 600px)': { maxWidth: '100%' },
              }}
            >
              {artistName}
            </Typography>
          </Tooltip>
          <Tooltip title={songTitle} arrow>
            <Typography
              sx={{
                fontSize: '0.84rem',
                // color: 'rgba(255,255,255,0.62)',
                // maxWidth: 250,
                overflowWrap: 'break-word',
                mt: 0.35,
                fontWeight: 500,
                lineHeight: 1.25,
                // whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minHeight: '1.05em',
                '@media (max-width: 600px)': { mb: 2, maxWidth: '100%' },
              }}
            >
              {songTitle}
            </Typography>
          </Tooltip>
        </Box>

        <Box>
          <CssEqualizer isPlaying={isPlaying} accentColor={accent} />
          <Box
            sx={{
              // position: 'absolute',
              // bottom: -4,
              // left: '50%',
              // transform: 'translate(25%, -0%)',

              // left: 0,
              // right: 0,
              // p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {/* <Chip
            size="small"
            icon={<PodcastsIcon sx={{ fontSize: 12, color: '#fff' }} />}
            label={currentStationData?.name || 'Radio'}
            sx={{
              height: 22,
              fontSize: '0.62rem',
              fontWeight: 700,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              '& .MuiChip-label': { px: 0.75 },
            }}
          /> */}
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                // color: 'rgba(255,255,255,0.85)',
                color: '#a855f7',
                fontFamily: 'monospace',
                // bgcolor: 'rgba(0,0,0,0.45)',
                // px: 0.75,
                // py: 0.25,
                borderRadius: '6px',
                // border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {playTime}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.2,
          flexShrink: 0,
          alignSelf: 'stretch',
          minWidth: 100,
          pb: 1,
          '@media (max-width: 600px)': { flexDirection: 'row', justifyContent: 'space-evenly' },
          // justify-content: space-evenly
        }}
      >
        {/* Кнопка смены радио — справа вверху */}
        <Tooltip title={showCarousel ? 'Закрыть карусель' : 'Сменить станцию'} arrow>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 0.6,
              ml: 'auto',
              '@media (max-width: 600px)': { ml: 0 },
              borderRadius: '16px',
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <IconButton
              onClick={() => {
                setShowHistory(false);
                setShowCarousel(v => !v);
              }}
              sx={{
                // position: 'absolute',
                // top: 12,
                // right: 12,
                // zIndex: 4,
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: showCarousel ? `${accent}18` : 'rgba(255,255,255,0.07)',
                // color: showCarousel ? accent : 'rgba(255,255,255,0.7)',
                border: `1px solid ${showCarousel ? `${accent}30` : 'rgba(255,255,255,0.1)'}`,
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: showCarousel ? `${accent}22` : 'rgba(255,255,255,0.12)',
                  // color: '#fff',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ViewCarouselIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Tooltip>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            // gap: 1,
            mr: 'auto',
            '@media (max-width: 600px)': { mr: 0 },
            p: 0.6,
            borderRadius: '20px',
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ width: 1, height: 28, bgcolor: 'rgba(255,255,255,0.08)' }} />
          <IconButton
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Пауза' : 'Играть'}
            sx={{
              width: 64,
              height: 64,
              borderRadius: '18px',
              background: `linear-gradient(135deg, ${accent} 0%, #7e22ce 100%)`,
              // color: '#fff',
              boxShadow: isPlaying ? `0 8px 20px ${accent}50` : `0 6px 16px ${accent}38`,
              border: '1px solid rgba(255,255,255,0.14)',
              '&:hover': { transform: 'scale(1.03)', boxShadow: `0 10px 24px ${accent}55` },
              '&:active': { transform: 'scale(0.97)' },
              transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.16), transparent 55%)',
                pointerEvents: 'none',
              },
            }}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: 36 }} /> : <PlayArrowIcon sx={{ fontSize: 36, ml: '2px' }} />}
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 0.6,
            ml: 'auto',
            '@media (max-width: 600px)': { ml: 0 },
            borderRadius: '16px',
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Tooltip title="История за час" arrow>
            <IconButton
              onClick={() => {
                setShowCarousel(false);
                setShowHistory(v => !v);
              }}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '12px',
                background: showHistory ? `${accent}18` : `linear-gradient(180deg, ${glassStrong}, ${glass})`,
                // color: showHistory ? accent : textMain,
                border: `1px solid ${showHistory ? `${accent}30` : 'rgba(255,255,255,0.1)'}`,
                boxShadow: showHistory ? `0 0 0 3px ${accent}14` : '0 2px 10px rgba(0,0,0,0.22)',
                '&:hover': {
                  background: showHistory ? `${accent}22` : 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <HistoryIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.7,
            px: 1,
            py: 0.35,
            borderRadius: '100px',
            bgcolor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: isPlaying ? '#22c55e' : 'rgba(255,255,255,0.35)',
              boxShadow: isPlaying ? '0 0 6px #22c55e' : 'none',
              animation: isPlaying ? 'livePulse 1.2s ease-in-out infinite' : 'none',
            }}
          />
          <Typography
            sx={{
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: isPlaying ? '#fff' : 'rgba(255,255,255,0.6)',
            }}
          >
            {isPlaying ? 'LIVE' : 'PAUSED'}
          </Typography>
          <Typography
            sx={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}
          >
            • {playTime}
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
};
