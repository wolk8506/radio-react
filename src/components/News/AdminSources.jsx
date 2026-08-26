import { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, Switch, IconButton,
  Stack, TextField, Button, Divider, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';
import { newsService } from '../../services/newsService';

export const AdminSources = () => {
  const [sources, setSources] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('rss');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    newsService.getSources().then(setSources).catch(() => toast.error('Не удалось загрузить источники'));
  };
  useEffect(load, []);

  const add = async () => {
    if (!title || !url) return toast.warning('Укажите название и ссылку');
    setSaving(true);
    try {
      await newsService.createSource({ title, url, type, category });
      setTitle(''); setUrl(''); setType('rss'); setCategory('');
      toast.success('Источник добавлен');
      load();
    } catch {
      toast.error('Ошибка добавления');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (src) => {
    try {
      await newsService.updateSource(src._id, { active: !src.active });
      load();
    } catch {
      toast.error('Ошибка обновления');
    }
  };

  const changeType = async (src, newType) => {
    try {
      await newsService.updateSource(src._id, { type: newType });
      load();
    } catch {
      toast.error('Ошибка обновления типа');
    }
  };

  const remove = async (id) => {
    try {
      await newsService.deleteSource(id);
      toast.success('Удалено');
      load();
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Добавить источник</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        <TextField size="small" label="Название" value={title} onChange={e => setTitle(e.target.value)} />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="src-type-label">Тип</InputLabel>
          <Select labelId="src-type-label" label="Тип" value={type} onChange={e => setType(e.target.value)}>
            <MenuItem value="rss">RSS</MenuItem>
            <MenuItem value="telegram">Telegram</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          label={type === 'telegram' ? 'Ссылка на канал' : 'RSS URL'}
          value={url}
          onChange={e => setUrl(e.target.value)}
          sx={{ minWidth: 280 }}
        />
        <TextField size="small" label="Категория" value={category} onChange={e => setCategory(e.target.value)} />
        <Button variant="contained" onClick={add} disabled={saving}>Добавить</Button>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Для Telegram укажите публичный канал, напр. https://t.me/rozetked (без /s/). Новости с украинского переводятся на русский автоматически.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Источники</Typography>
      <List dense>
        {sources.map(src => (
          <ListItem
            key={src._id}
            secondaryAction={
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControl size="small">
                  <Select value={src.type || 'rss'} onChange={e => changeType(src, e.target.value)}>
                    <MenuItem value="rss">RSS</MenuItem>
                    <MenuItem value="telegram">TG</MenuItem>
                  </Select>
                </FormControl>
                <Switch size="small" checked={src.active} onChange={() => toggleActive(src)} />
                <IconButton edge="end" onClick={() => remove(src._id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            }
          >
            <ListItemText
              primary={src.title}
              secondary={`${src.url}${src.lastError ? ` · ошибка: ${src.lastError}` : ''}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
