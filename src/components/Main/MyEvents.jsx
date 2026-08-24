import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FormatListBulletIcon from '@mui/icons-material/FormatListNumbered';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const STORAGE_KEY = 'my_events';

const getStoredEvents = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEvents = events => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '', description: '' });
  const [calendarMonth, setCalendarMonth] = useState(moment());

  useEffect(() => {
    setEvents(getStoredEvents());
  }, []);

  const handleSaveEvent = () => {
    if (!formData.title.trim() || !formData.date) return;

    if (editingEvent) {
      const updated = events.map(e => (e.id === editingEvent.id ? { ...e, ...formData } : e));
      setEvents(updated);
      saveEvents(updated);
    } else {
      const newEvent = {
        id: Date.now().toString(),
        ...formData,
        createdAt: moment().toISOString(),
      };
      const updated = [...events, newEvent];
      setEvents(updated);
      saveEvents(updated);
    }
    resetForm();
  };

  const handleDeleteEvent = id => {
    if (!window.confirm('Удалить это событие?')) return;
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveEvents(updated);
    if (selectedEvent?.id === id) setSelectedEvent(null);
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormData({ title: '', date: moment().format('YYYY-MM-DD'), description: '' });
    setDialogOpen(true);
  };

  const openEditDialog = event => {
    setEditingEvent(event);
    setFormData({ title: event.title, date: event.date, description: event.description || '' });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({ title: '', date: '', description: '' });
    setDialogOpen(false);
  };

  const selectEvent = event => {
    setSelectedEvent(event);
    setActiveTab(2);
  };

  const prevMonth = () => setCalendarMonth(m => m.clone().subtract(1, 'month'));
  const nextMonth = () => setCalendarMonth(m => m.clone().add(1, 'month'));

  const daysInMonth = calendarMonth.daysInMonth();
  const firstDayOfMonth = calendarMonth.clone().startOf('month').day();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonthDays = calendarMonth.clone().subtract(1, 'month').daysInMonth();
  const calendarDays = [];

  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, currentMonth: true });
  }
  const remainingCells = 35 - calendarDays.length; // Использование 5 строк для компактности
  const extraCells = remainingCells >= 0 ? remainingCells : 42 - calendarDays.length;
  for (let d = 1; d <= extraCells; d++) {
    calendarDays.push({ day: d, currentMonth: false });
  }

  const hasEventOnDay = day => {
    if (!day.currentMonth) return false;
    const dateStr = calendarMonth.clone().date(day.day).format('YYYY-MM-DD');
    return events.some(e => e.date === dateStr);
  };

  const getEventForDay = day => {
    if (!day.currentMonth) return null;
    const dateStr = calendarMonth.clone().date(day.day).format('YYYY-MM-DD');
    return events.find(e => e.date === dateStr);
  };

  return (
    <Box
      className="col-6 row-span-5 card-main-page"
      sx={{
        // width: '100%',
        height: '236px',
        // borderRadius: '22px',
        // padding: '16px 20px',
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
      {/* Шапка */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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
          <EventAvailableIcon sx={{ fontSize: '0.9rem' }} />
          Мои события
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Переключатель вкладок */}
          <Box
            sx={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '10px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {[
              { id: 1, icon: <FormatListBulletIcon sx={{ fontSize: '0.9rem' }} />, title: 'Список' },
              { id: 2, icon: <InfoIcon sx={{ fontSize: '0.9rem' }} />, title: 'Детали' },
              { id: 3, icon: <CalendarMonthIcon sx={{ fontSize: '0.9rem' }} />, title: 'Календарь' },
            ].map(tab => (
              <IconButton
                key={tab.id}
                size="small"
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  color: activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
                }}
                title={tab.title}
              >
                {tab.icon}
              </IconButton>
            ))}
          </Box>

          <Button
            size="small"
            startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={openCreateDialog}
            sx={{
              background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 600,
              borderRadius: '10px',
              textTransform: 'none',
              padding: '3px 10px',
              minWidth: 'auto',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #9333ea 0%, #6d28d9 100%)',
              },
            }}
          >
            Создать
          </Button>
        </Box>
      </Box>

      {/* Контент вкладок */}
      <Box sx={{ flex: 1, mt: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Tab 1: Список */}
        {activeTab === 1 && (
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: '4px' },
            }}
          >
            {events.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.8rem',
                }}
              >
                Событий нет. Создайте первое событие.
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {events.map(event => (
                  <Box
                    key={event.id}
                    onClick={() => selectEvent(event)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      '&:hover': { background: 'rgba(255, 255, 255, 0.08)' },
                    }}
                  >
                    <Box sx={{ overflow: 'hidden', mr: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {moment(event.date).format('DD MMMM YYYY')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                      <IconButton
                        size="small"
                        onClick={e => {
                          e.stopPropagation();
                          openEditDialog(event);
                        }}
                        sx={{ color: 'rgba(255, 255, 255, 0.6)', padding: '2px' }}
                      >
                        <EditIcon sx={{ fontSize: '0.8rem' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                        sx={{ color: 'rgba(239, 68, 68, 0.8)', padding: '2px' }}
                      >
                        <DeleteIcon sx={{ fontSize: '0.8rem' }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: Детали */}
        {activeTab === 2 && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {selectedEvent ? (
              <>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {selectedEvent.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {moment(selectedEvent.date).format('DD MMM YYYY')}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      maxHeight: '90px',
                      overflowY: 'auto',
                    }}
                  >
                    {selectedEvent.description || 'Описание отсутствует'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon sx={{ fontSize: '0.8rem' }} />}
                    onClick={() => openEditDialog(selectedEvent)}
                    sx={{
                      color: '#fff',
                      fontSize: '0.7rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      textTransform: 'none',
                    }}
                  >
                    Изменить
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon sx={{ fontSize: '0.8rem' }} />}
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    sx={{ fontSize: '0.7rem', textTransform: 'none' }}
                  >
                    Удалить
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.8rem',
                }}
              >
                Выберите событие из списка или календаря
              </Box>
            )}
          </Box>
        )}

        {/* Tab 3: Календарь */}
        {activeTab === 3 && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <IconButton size="small" onClick={prevMonth} sx={{ color: 'rgba(255, 255, 255, 0.6)', padding: '2px' }}>
                <ChevronLeftIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>
                {calendarMonth.format('MMMM YYYY')}
              </Typography>
              <IconButton size="small" onClick={nextMonth} sx={{ color: 'rgba(255, 255, 255, 0.6)', padding: '2px' }}>
                <ChevronRightIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
                <Typography key={i} sx={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600 }}>
                  {d}
                </Typography>
              ))}

              {calendarDays.map((cd, i) => {
                const event = getEventForDay(cd);
                const isToday =
                  cd.currentMonth &&
                  calendarMonth.month() === moment().month() &&
                  calendarMonth.year() === moment().year() &&
                  cd.day === moment().date();
                const hasEvent = hasEventOnDay(cd);

                return (
                  <Tooltip key={i} title={event ? event.title : ''} arrow placement="top">
                    <Box
                      onClick={() => cd.currentMonth && event && selectEvent(event)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        borderRadius: '6px',
                        cursor: cd.currentMonth && event ? 'pointer' : 'default',
                        color: !cd.currentMonth ? 'rgba(255, 255, 255, 0.15)' : isToday ? '#a855f7' : '#fff',
                        fontWeight: isToday || hasEvent ? 700 : 400,
                        background: hasEvent
                          ? 'rgba(168, 85, 247, 0.3)'
                          : isToday
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'transparent',
                        border: isToday ? '1px solid rgba(168, 85, 247, 0.5)' : 'none',
                        transition: 'all 0.2s',
                        '&:hover': cd.currentMonth && event ? { background: 'rgba(168, 85, 247, 0.5)' } : {},
                      }}
                    >
                      {cd.day}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* Диалог создания / редактирования */}
      <Dialog
        open={dialogOpen}
        onClose={resetForm}
        maxWidth="xs"
        fullWidth
        className="card-main-page"
        PaperProps={{
          // sx: {
          //   background: 'rgba(30, 35, 45, 0.85)',
          //   backdropFilter: 'blur(30px)',
          //   borderRadius: '20px',
          //   border: '1px solid rgba(255, 255, 255, 0.18)',
          //   color: '#fff',
          // },
        }}
      >
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 600 }}>
          {editingEvent ? 'Редактировать событие' : 'Новое событие'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Название"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': { color: '#fff' },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          />
          <TextField
            type="date"
            label="Дата"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputBase-root': { color: '#fff' },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          />
          <TextField
            label="Описание"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={{
              '& .MuiInputBase-root': { color: '#fff' },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={resetForm} sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEvent}
            sx={{
              background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
              textTransform: 'none',
              borderRadius: '8px',
            }}
          >
            {editingEvent ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
