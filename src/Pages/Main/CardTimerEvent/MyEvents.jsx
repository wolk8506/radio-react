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
  Select,
  MenuItem,
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

import { eventsService } from '../eventsService';
import { toast } from 'react-toastify';

moment.locale('ru');

const EMOJI_PRESETS = ['🎉', '🎂', '💼', '🏖️', '❤️', '📅', '⚽', '🎓', '🎄', '💡', '🎵', '🚀'];

const PERIODICITY = [
  { value: 'none', label: 'Не повторяется' },
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' },
  { value: 'yearly', label: 'Ежегодно' },
];

const PRIVACY = [
  { value: 'private', label: 'Приватное' },
  { value: 'public', label: 'Публичное' },
];

const EVENT_TYPES = [
  { value: 'personal', label: 'Личное' },
  { value: 'work', label: 'Работа' },
  { value: 'holiday', label: 'Праздник' },
  { value: 'birthday', label: 'День рождения' },
  { value: 'meeting', label: 'Встреча' },
  { value: 'other', label: 'Другое' },
];

const labelOf = (list, val) => (list.find(o => o.value === val) || {}).label || val;

const emptyForm = () => ({
  title: '',
  description: '',
  icon: '',
  startDate: moment().format('YYYY-MM-DD'),
  endDate: '',
  periodicity: 'none',
  privacy: 'private',
  eventType: 'personal',
});

export const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [calendarMonth, setCalendarMonth] = useState(moment());

  useEffect(() => {
    let mounted = true;
    eventsService
      .getEvents()
      .then(data => {
        if (mounted) setEvents(data || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveEvent = async () => {
    if (!formData.title.trim()) return;

    try {
      if (editingEvent) {
        const updated = await eventsService.updateEvent(editingEvent.id, formData);
        setEvents(prev => prev.map(e => (e.id === updated.id ? updated : e)));
        setSelectedEvent(prev => (prev && prev.id === updated.id ? updated : prev));
      } else {
        const created = await eventsService.createEvent(formData);
        setEvents(prev => [...prev, created]);
        setSelectedEvent(created);
      }
    } catch {
      toast.error('Не удалось сохранить событие');
    }
    resetForm();
  };

  const handleDeleteEvent = async id => {
    if (!window.confirm('Удалить это событие?')) return;
    try {
      await eventsService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } catch {
      // игнорируем ошибку удаления
    }
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormData(emptyForm());
    setDialogOpen(true);
  };

  const openEditDialog = event => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      icon: event.icon || '',
      startDate: event.startDate || moment().format('YYYY-MM-DD'),
      endDate: event.endDate || '',
      periodicity: event.periodicity || 'none',
      privacy: event.privacy || 'private',
      eventType: event.eventType || 'personal',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData(emptyForm());
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
  const remainingCells = 35 - calendarDays.length;
  const extraCells = remainingCells >= 0 ? remainingCells : 42 - calendarDays.length;
  for (let d = 1; d <= extraCells; d++) {
    calendarDays.push({ day: d, currentMonth: false });
  }

  const eventOnDay = day => {
    if (!day.currentMonth) return null;
    const dateStr = calendarMonth.clone().date(day.day).format('YYYY-MM-DD');
    return (
      events.find(e => {
        const end = e.endDate || e.startDate;
        return dateStr >= e.startDate && dateStr <= end;
      }) || null
    );
  };

  const hasEventOnDay = day => !!eventOnDay(day);

  const fieldSx = {
    '& .MuiInputBase-root': { color: '#fff' },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };

  return (
    <Box
      className="col-6 row-span-5 card-main-page"
      sx={{
        height: { xs: 'auto', md: 236 },
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
            {loading ? (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.8rem' }}>
                Загрузка…
              </Box>
            ) : events.length === 0 ? (
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
                    <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', mr: 1 }}>
                      {event.icon && (
                        <Typography sx={{ fontSize: '1rem', mr: 1, flexShrink: 0 }}>{event.icon}</Typography>
                      )}
                      <Box sx={{ overflow: 'hidden' }}>
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
                          {moment(event.startDate).format('DD MMMM YYYY')}
                          {event.endDate && event.endDate !== event.startDate
                            ? ` — ${moment(event.endDate).format('DD MMMM YYYY')}`
                            : ''}
                        </Typography>
                      </Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                      {selectedEvent.icon && <Typography sx={{ fontSize: '1.3rem' }}>{selectedEvent.icon}</Typography>}
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{selectedEvent.title}</Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {labelOf(EVENT_TYPES, selectedEvent.eventType)}
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                    {moment(selectedEvent.startDate).format('DD MMM YYYY')}
                    {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.startDate
                      ? ` — ${moment(selectedEvent.endDate).format('DD MMM YYYY')}`
                      : ''}
                    {' · '}
                    {labelOf(PERIODICITY, selectedEvent.periodicity)}
                    {' · '}
                    {labelOf(PRIVACY, selectedEvent.privacy)}
                  </Typography>

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
                const event = eventOnDay(cd);
                const isToday =
                  cd.currentMonth &&
                  calendarMonth.month() === moment().month() &&
                  calendarMonth.year() === moment().year() &&
                  cd.day === moment().date();
                const hasEvent = hasEventOnDay(cd);

                return (
                  <Tooltip key={i} title={event ? `${event.icon ? event.icon + ' ' : ''}${event.title}` : ''} arrow placement="top">
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
      <Dialog open={dialogOpen} onClose={resetForm} maxWidth="xs" fullWidth className="card-main-page" disableScrollLock>
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
            sx={fieldSx}
          />

          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>Иконка (эмодзи)</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {EMOJI_PRESETS.map(em => (
                <IconButton
                  key={em}
                  onClick={() => setFormData({ ...formData, icon: em })}
                  sx={{
                    fontSize: '1.1rem',
                    width: 32,
                    height: 32,
                    background: formData.icon === em ? 'rgba(168, 85, 247, 0.4)' : 'rgba(0, 0, 0, 0.25)',
                    border: formData.icon === em ? '1px solid rgba(168, 85, 247, 0.7)' : '1px solid transparent',
                    borderRadius: '8px',
                  }}
                >
                  {em}
                </IconButton>
              ))}
            </Box>
            <TextField
              label="Свой эмодзи"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              fullWidth
              size="small"
              variant="outlined"
              sx={fieldSx}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              type="date"
              label="Дата начала"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <TextField
              type="date"
              label="Дата окончания"
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Select
              value={formData.eventType}
              onChange={e => setFormData({ ...formData, eventType: e.target.value })}
              size="small"
              fullWidth
              displayEmpty
              sx={{ ...fieldSx, color: '#fff' }}
            >
              {EVENT_TYPES.map(o => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={formData.periodicity}
              onChange={e => setFormData({ ...formData, periodicity: e.target.value })}
              size="small"
              fullWidth
              displayEmpty
              sx={{ ...fieldSx, color: '#fff' }}
            >
              {PERIODICITY.map(o => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Select
            value={formData.privacy}
            onChange={e => setFormData({ ...formData, privacy: e.target.value })}
            size="small"
            fullWidth
            displayEmpty
            sx={{ ...fieldSx, color: '#fff' }}
          >
            {PRIVACY.map(o => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Описание"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={fieldSx}
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
