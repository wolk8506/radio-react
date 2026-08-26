import { useEffect, useState } from 'react';
import { Box, Typography, Chip, Stack, Button, Alert } from '@mui/material';
import { toast } from 'react-toastify';
import { newsService } from '../../services/newsService';

export const InterestSettings = () => {
  const [facets, setFacets] = useState({ categories: [], tags: [] });
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([newsService.getFacets(), newsService.getInterests()])
      .then(([f, interest]) => {
        if (!active) return;
        setFacets(f);
        setSelectedTags((interest.tags || []).map(t => t.tag));
        setSelectedCats(interest.categories || []);
      })
      .catch(() => toast.error('Не удалось загрузить интересы'))
      .finally(() => active && setLoading(false));
  }, []);

  const toggleTag = name => {
    setSelectedTags(prev => (prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]));
  };
  const toggleCat = name => {
    setSelectedCats(prev => (prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]));
  };

  const save = async () => {
    setSaving(true);
    try {
      await newsService.updateInterests({
        tags: selectedTags.map(tag => ({ tag, weight: 1 })),
        categories: selectedCats,
      });
      toast.success('Интересы сохранены');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Категории интересов
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
        {(facets.categories || []).map(c => (
          <Chip
            key={c.name}
            label={c.name}
            color={selectedCats.includes(c.name) ? 'primary' : 'default'}
            variant={selectedCats.includes(c.name) ? 'filled' : 'outlined'}
            onClick={() => toggleCat(c.name)}
          />
        ))}
      </Stack>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Теги интересов
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
        {(facets.tags || []).map(t => (
          <Chip
            key={t.name}
            label={t.name}
            color={selectedTags.includes(t.name) ? 'primary' : 'default'}
            variant={selectedTags.includes(t.name) ? 'filled' : 'outlined'}
            onClick={() => toggleTag(t.name)}
          />
        ))}
      </Stack>

      <Alert severity="info" sx={{ mb: 2 }}>
        Выбранные категории и теги повышают релевантность ленты. Новости ранжируются по совпадению с вашими интересами.
      </Alert>

      <Button variant="contained" onClick={save} disabled={saving}>
        Сохранить интересы
      </Button>
    </Box>
  );
};
