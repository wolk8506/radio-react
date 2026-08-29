import { Stack, FormControl, InputLabel, Select, MenuItem, Chip, FormControlLabel, Box } from '@mui/material';
import CustomSwitch from 'components/Elements/CustomSwitch';

export const NewsFilters = ({
  facets,
  category,
  setCategory,
  tag,
  setTag,
  personalized,
  setPersonalized,
  disabledPersonalized,
}) => {
  const topTags = (facets.tags || []).slice(0, 12);

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="news-cat">Категория</InputLabel>
          <Select
            labelId="news-cat"
            label="Категория"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {(facets.categories || []).map(c => (
              <MenuItem key={c.name} value={c.name}>
                {c.name} ({c.count})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          labelPlacement="start"
          control={
            <CustomSwitch checked={personalized} onChange={e => setPersonalized(e.target.checked)} disabled={disabledPersonalized} />
          }
          label="Персонализация"
        />
      </Stack>

      {topTags.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
          {topTags.map(t => (
            <Chip
              key={t.name}
              size="small"
              label={`${t.name} (${t.count})`}
              color={tag === t.name ? 'primary' : 'default'}
              variant={tag === t.name ? 'filled' : 'outlined'}
              onClick={() => setTag(tag === t.name ? '' : t.name)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};
