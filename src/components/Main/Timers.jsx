import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timerOperations, timerSelectors } from 'store';

// MUI Components
import { Box, Typography, InputBase, Button, IconButton, Tooltip } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const MAX_TIMERS = 6;

export const Timers = () => {
  const dispatch = useDispatch();
  const timers = useSelector(timerSelectors.getTimers) || [];

  const [mode, setMode] = useState('list');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    dispatch(timerOperations.loadTimers());
  }, [dispatch]);

  const handleAddTimer = e => {
    e.preventDefault();
    if (name.trim() && date && timers.length < MAX_TIMERS) {
      // Добавляем id (Date.now()), чтобы у объекта гарантированно был уникальный ключ
      const newTimer = {
        id: Date.now(),
        name: name.trim(),
        targetDate: date,
      };
      dispatch(timerOperations.addTimer(newTimer));
      setName('');
      setDate('');
      setMode('list');
    }
  };

  const handleDeleteTimer = (timer, index) => {
    // Передаем id (если появится) или индекс массива (index)
    const targetPayload = timer.id !== undefined ? timer.id : index;
    dispatch(timerOperations.deleteTimer(targetPayload));
  };

  const isLimitReached = timers.length >= MAX_TIMERS;

  return (
    <Box
      className="col-6 row-span-5 card-main-page"
      sx={{
        height: '236px',
        // borderRadius: '22px',
        // padding: '18px 20px',
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'space-between',
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
      {/* Шапка карточки */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
          <HourglassTopIcon sx={{ fontSize: '0.85rem' }} />
          {mode === 'create' ? 'Новый таймер' : `Таймеры (${timers.length}/${MAX_TIMERS})`}
        </Typography>

        {mode === 'list' ? (
          <Tooltip title={isLimitReached ? 'Достигнут лимит (макс. 6)' : 'Добавить таймер'}>
            <span>
              <IconButton
                size="small"
                onClick={() => setMode('create')}
                disabled={isLimitReached}
                sx={{
                  color: isLimitReached ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.65)',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                  padding: 0,
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ) : (
          <IconButton
            size="small"
            onClick={() => setMode('list')}
            sx={{
              color: 'rgba(255, 255, 255, 0.65)',
              '&:hover': { color: '#fff' },
              padding: 0,
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Список таймеров или форма создания */}
      {mode === 'list' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            alignContent: 'start',
            overflowY: 'auto',
            my: 'auto',
            maxHeight: '100%',
            py: 0.5,
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {timers.length > 0 ? (
            timers.map((timer, idx) => (
              <TimerItem key={timer.id || idx} timer={timer} onDelete={() => handleDeleteTimer(timer, idx)} />
            ))
          ) : (
            <Typography
              sx={{
                gridColumn: 'span 3',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.8rem',
                textAlign: 'center',
                py: 2,
              }}
            >
              Нет активных таймеров
            </Typography>
          )}
        </Box>
      ) : (
        /* Форма создания */
        <Box
          component="form"
          onSubmit={handleAddTimer}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            my: 'auto',
            width: '100%',
            padding: '6px 0',
          }}
        >
          <InputBase
            placeholder="Название таймера"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
            sx={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '0.85rem',
              '& input::placeholder': {
                color: 'rgba(255, 255, 255, 0.4)',
                opacity: 1,
              },
            }}
          />
          <InputBase
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            sx={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '0.85rem',
              colorScheme: 'dark',
            }}
          />
          <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              size="small"
              onClick={() => setMode('list')}
              sx={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              size="small"
              sx={{
                background: '#a855f7',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'none',
                padding: '4px 16px',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
                '&:hover': { background: '#9333ea' },
              }}
            >
              Создать
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const TimerItem = ({ timer, onDelete }) => {
  const [shortTime, setShortTime] = useState('');
  const [fullTime, setFullTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const target = moment(timer.targetDate || timer.date);
      const now = moment();
      const diff = target.diff(now);

      if (diff <= 0) {
        setShortTime('0с');
        setFullTime('Завершено');
        return;
      }

      const duration = moment.duration(diff);
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      if (days > 0) {
        setShortTime(`${days}д`);
      } else if (hours > 0) {
        setShortTime(`${hours}ч`);
      } else if (minutes > 0) {
        setShortTime(`${minutes}м`);
      } else {
        setShortTime(`${seconds}с`);
      }

      const parts = [];
      if (days > 0) parts.push(`${days}д`);
      if (hours > 0 || days > 0) parts.push(`${hours}ч`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}м`);
      parts.push(`${seconds}с`);

      setFullTime(parts.join(' '));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timer.targetDate, timer.date]);

  const handleDeleteClick = e => {
    e.stopPropagation();
    e.preventDefault();
    onDelete();
  };

  return (
    <Box
      sx={{
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '8px 10px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        transition: 'background 0.2s',

        '&:hover .delete-btn': {
          opacity: 1,
          visibility: 'visible',
        },
      }}
    >
      {/* Элемент времени */}
      <Box
        sx={{
          height: '34px',
          minWidth: '34px',
          borderRadius: '17px',
          border: '2px solid #a855f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#ffffff',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          zIndex: 1,

          '& .time-short': { display: 'block' },
          '& .time-full': { display: 'none' },

          '&:hover': {
            background: 'rgba(168, 85, 247, 0.25)',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
            padding: '0 10px',

            '& .time-short': { display: 'none' },
            '& .time-full': { display: 'block' },
          },
        }}
      >
        <span className="time-short">{shortTime}</span>
        <span className="time-full">{fullTime}</span>
      </Box>

      {/* Название */}
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#ffffff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
          pr: '20px',
        }}
      >
        {timer.name}
      </Typography>

      {/* Кнопка удаления */}
      <IconButton
        className="delete-btn"
        onClick={handleDeleteClick}
        size="small"
        sx={{
          position: 'absolute',
          right: '4px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.2s, color 0.2s',
          color: 'rgba(255, 255, 255, 0.5)',
          padding: '4px',
          '&:hover': {
            color: '#fb7185',
            background: 'rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: '0.85rem' }} />
      </IconButton>
    </Box>
  );
};
