import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { authSelectors } from 'store';
import {
  listLibrary,
  createLibrary,
  updateLibrary,
  deleteLibrary,
} from 'services/libraryService';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { toast } from 'react-toastify';

const CONFIG = {
  events: {
    label: 'События',
    hasDate: true,
    fields: [
      { key: 'date', label: 'Дата (ММ-ДД)', required: true, placeholder: '01-01' },
      { key: 'title', label: 'Название', required: true },
      { key: 'emoji', label: 'Эмодзи' },
      { key: 'description', label: 'Описание', multiline: true },
    ],
  },
  facts: {
    label: 'Факты',
    hasDate: true,
    fields: [
      { key: 'date', label: 'Дата (ММ-ДД)', required: true, placeholder: '01-01' },
      { key: 'text', label: 'Текст', required: true, multiline: true },
    ],
  },
  jokes: {
    label: 'Шутки',
    hasDate: false,
    fields: [{ key: 'text', label: 'Текст шутки', required: true, multiline: true }],
  },
};

const FIELD_LABELS = {
  date: 'Дата',
  title: 'Название',
  emoji: 'Эмодзи',
  description: 'Описание',
  text: 'Текст',
};

export const LibraryAdmin = ({ type }) => {
  const isAdmin = useSelector(authSelectors.getIsAdmin);
  const cfg = CONFIG[type];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const load = async (searchValue = search, dateValue = dateFilter) => {
    setLoading(true);
    try {
      const params = {};
      if (searchValue) params.search = searchValue;
      if (cfg.hasDate && dateValue) params.date = dateValue;
      const data = await listLibrary(type, params);
      setItems(data);
    } catch {
      toast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    const t = setTimeout(() => load(search, dateFilter), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, dateFilter, type]);

  useEffect(() => {
    if (!isAdmin) return;
    setItems([]);
  }, [type, isAdmin]);

  if (!isAdmin) return <Navigate to="/profile" replace />;

  const openAdd = () => {
    const initial = {};
    cfg.fields.forEach(f => (initial[f.key] = ''));
    setEditing(null);
    setForm(initial);
    setDialogOpen(true);
  };

  const openEdit = item => {
    const initial = {};
    cfg.fields.forEach(f => (initial[f.key] = item[f.key] ?? ''));
    setEditing(item);
    setForm(initial);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const missing = cfg.fields.find(f => f.required && !form[f.key]?.trim());
    if (missing) {
      toast.warn(`Заполните поле «${missing.label}»`);
      return;
    }
    const payload = {};
    cfg.fields.forEach(f => (payload[f.key] = form[f.key]));
    try {
      if (editing) {
        await updateLibrary(type, editing._id, payload);
        toast.success('Запись обновлена');
      } else {
        await createLibrary(type, payload);
        toast.success('Запись добавлена');
      }
      setDialogOpen(false);
      load();
    } catch {
      toast.error('Не удалось сохранить запись');
    }
  };

  const handleDelete = async id => {
    try {
      await deleteLibrary(type, id);
      toast.success('Запись удалена');
      load();
    } catch {
      toast.error('Не удалось удалить запись');
    }
  };

  const columns = cfg.fields.map(f => f.key);

  return (
    <div className="block__library-admin" style={{ marginTop: '12px', width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: '', alignItems: 'center', mb: 2 }}>
        <TextField
          size="small"
          label="Поиск по названию/тексту"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }}
        />
        {cfg.hasDate && (
          <TextField
            size="small"
            label="Дата (ММ-ДД)"
            placeholder="01-01"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        )}
        <Button type="button" variant="outlined" sx={{ width: 250 }} startIcon={<AddIcon />} onClick={openAdd}>
          Добавить
        </Button>
      </Box>

      {loading ? (
        <Typography>Загрузка…</Typography>
      ) : (
        <TableContainer className="block" sx={{ height: 700 }} variant="head">
          <Table size="small" className="block1" stickyHeader>
            <TableHead >
              <TableRow>
                {columns.map(c => (
                  <TableCell key={c}>{FIELD_LABELS[c] || c}</TableCell>
                ))}
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <TableRow key={item._id}>
                  {columns.map(c => (
                    <TableCell key={c} sx={{ maxWidth: 320, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {item[c]}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Tooltip title="Изменить">
                      <IconButton size="small" onClick={() => openEdit(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton size="small" color="error" onClick={() => handleDelete(item._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    Ничего не найдено
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth disableScrollLock>
        <DialogTitle>{editing ? 'Редактировать запись' : `Новая запись — ${cfg.label}`}</DialogTitle>
        <DialogContent>
          {cfg.fields.map(f => (
            <TextField
              key={f.key}
              margin="dense"
              fullWidth
              multiline={f.multiline}
              minRows={f.multiline ? 3 : 1}
              label={f.label}
              placeholder={f.placeholder}
              value={form[f.key] ?? ''}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
