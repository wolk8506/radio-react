import { Card, CardContent, Typography, Chip, Stack, Link } from '@mui/material';

const fmtDate = d => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const NewsCard = ({ item }) => {
  const source = item.source || {};
  return (
    <Card variant="outlined" sx={{ mb: 2, bgcolor: 'background.paper' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {source.title || 'источник'}
            {item.author ? ` · ${item.author}` : ''}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {fmtDate(item.publishedAt)}
          </Typography>
        </Stack>

        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: 'text.primary', fontWeight: 600 }}
        >
          <Typography variant="h6" component="div" sx={{ fontSize: 18, lineHeight: 1.3 }}>
            {item.title}
          </Typography>
        </Link>

        {item.summary && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {item.summary}
          </Typography>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
          {item.category && <Chip size="small" color="primary" label={item.category} />}
          {(item.tags || []).map(t => (
            <Chip key={t} size="small" variant="outlined" label={t} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
