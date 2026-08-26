import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NavigationIcon from '@mui/icons-material/Navigation';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CloudIcon from '@mui/icons-material/Cloud';

import { weatherSelectors, weatherOperations, rootSelectors } from 'store';
import weatherImage from 'components/Weather/weatherIcon';

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export const WeatherCardHalloween = () => {
  const dispatch = useDispatch();
  const themeImageWeather = useSelector(rootSelectors.getThemeIconWeather);
  const CITY = useSelector(weatherSelectors.getCityName);
  const data = useSelector(weatherSelectors.getWeatherToday_Data);

  const URL_WEATHER = useMemo(() => {
    if (!CITY) return '';
    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours%2Cdays&key=GP4GVCRSPM49PLYL6GG3XCCND&contentType=json&lang=ru&unitGroup=metric`;
  }, [CITY]);

  useEffect(() => {
    if (CITY === null) {
      dispatch(weatherOperations.fetchLocation());
    } else if (URL_WEATHER) {
      dispatch(weatherOperations.fetchWeatherToday(URL_WEATHER));
    }
  }, [CITY, URL_WEATHER, dispatch]);

  useEffect(() => {
    if (!URL_WEATHER) return;
    const interval = setInterval(() => {
      dispatch(weatherOperations.fetchWeatherToday(URL_WEATHER));
    }, 900000);
    return () => clearInterval(interval);
  }, [URL_WEATHER, dispatch]);

  const hourIndex = parseInt(moment().format('H'), 10);
  const current = data?.days?.[0]?.hours?.[hourIndex] || data?.days?.[0]?.hours?.[0];

  const temperature = current ? Math.round(current.temp) : '--';
  const iconName = current?.icon || 'clear-day';
  const currentIconSrc = weatherImage(iconName, themeImageWeather);

  const windSpeed = current?.windspeed ? Math.round(current.windspeed) : 0;
  const windDir = current?.winddir ?? 0;
  const humidity = current?.humidity ? Math.round(current.humidity) : 0;
  const windGust = current?.windgust ? Math.round(current.windgust) : 0;
  const cloudCover = current?.cloudcover ? Math.round(current.cloudcover) : 0;

  return (
    <Box
      className="col-6 row-span-5 card-main-page"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '236px',
        '@media (max-width: 768px)': {
          height: 'auto',
          minHeight: 'auto',
        },
        background: 'linear-gradient(135deg, #2a0e3a 0%, #3a0d2e 55%, #160a26 100%)',
        border: '1px solid rgba(255, 117, 24, 0.35)',
        boxShadow:
          '0 0 24px rgba(255, 117, 24, 0.22), inset 0 0 30px rgba(168, 85, 247, 0.15)',
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
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '4px',
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
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textShadow: '0 0 10px rgba(255, 117, 24, 0.5)',
          }}
        >
          <WbSunnyIcon sx={{ fontSize: '0.85rem' }} />
          Погода {CITY ? `— ${CITY}` : ''}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'rgba(255, 200, 150, 0.7)',
            textTransform: 'capitalize',
          }}
        >
          {moment().format('dddd, D MMMM')}
        </Typography>
      </Box>

      {/* Основной блок */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
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
        {/* Иконка и Температура */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <Box
            component="img"
            src={currentIconSrc}
            alt={iconName}
            sx={{
              width: 90,
              height: 90,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 14px rgba(255, 140, 0, 0.55))',
            }}
          />

          <Typography
            sx={{
              fontSize: '3.2rem',
              fontWeight: 800,
              color: '#ff8c00',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              textShadow: '0 0 16px rgba(255, 140, 0, 0.7)',
              '@media (max-width: 768px)': {
                fontSize: '2.6rem',
              },
            }}
          >
            {temperature}°
          </Typography>
        </Box>

        {/* Метрики */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            flex: 1,
            '@media (max-width: 768px)': {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              width: '100%',
              flex: 'none',
            },
          }}
        >
          <Box
            sx={{
              background: 'rgba(255, 117, 24, 0.12)',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(255, 117, 24, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255, 180, 120, 0.85)' }}>
              <NavigationIcon
                sx={{
                  fontSize: '0.75rem',
                  transform: `rotate(${windDir}deg)`,
                  transition: 'transform 0.3s ease',
                }}
              />
              <Typography sx={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Ветер</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              {windSpeed} <span style={{ fontSize: '0.65rem', fontWeight: 400 }}>км/ч</span>
            </Typography>
          </Box>

          <Box
            sx={{
              background: 'rgba(168, 85, 247, 0.12)',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(216, 179, 255, 0.85)' }}>
              <WaterDropIcon sx={{ fontSize: '0.75rem' }} />
              <Typography sx={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Влажность
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{humidity}%</Typography>
          </Box>

          <Box
            sx={{
              background: 'rgba(255, 117, 24, 0.12)',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(255, 117, 24, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255, 180, 120, 0.85)' }}>
              <AirIcon sx={{ fontSize: '0.75rem' }} />
              <Typography sx={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>Порывы</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              {windGust} <span style={{ fontSize: '0.65rem', fontWeight: 400 }}>км/ч</span>
            </Typography>
          </Box>

          <Box
            sx={{
              background: 'rgba(168, 85, 247, 0.12)',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(216, 179, 255, 0.85)' }}>
              <CloudIcon sx={{ fontSize: '0.75rem' }} />
              <Typography sx={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Облачность
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{cloudCover}%</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
