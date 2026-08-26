import { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, CircularProgress, Button, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { authSelectors } from 'store';
import { newsService } from '../../services/newsService';
import { NewsCard } from './NewsCard';
import { NewsFilters } from './NewsFilters';
import { InterestSettings } from './InterestSettings';
import { AdminSources } from './AdminSources';

export const News = () => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const isAdmin = useSelector(authSelectors.getIsAdmin);

  const [tab, setTab] = useState('feed');
  const [facets, setFacets] = useState({ categories: [], tags: [] });

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [personalized, setPersonalized] = useState(isLoggedIn);

  useEffect(() => {
    newsService.getFacets().then(setFacets).catch(() => {});
  }, []);

  // сброс при смене фильтров/вкладки
  useEffect(() => {
    if (tab !== 'feed') return;
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [category, tag, personalized, tab]);

  useEffect(() => {
    if (tab !== 'feed') return;
    let active = true;
    setLoading(true);
    newsService
      .getFeed({ page, limit: 10, category, tag, personalized: String(personalized) })
      .then(data => {
        if (!active) return;
        setItems(prev => (page === 1 ? data.items : [...prev, ...data.items]));
        setHasMore(data.hasMore);
      })
      .catch(() => toast.error('Ошибка загрузки ленты'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [page, category, tag, personalized, tab]);

  const loadMore = () => setPage(p => p + 1);

  const tabs = [
    { key: 'feed', label: 'Лента' },
    ...(isLoggedIn ? [{ key: 'interests', label: 'Интересы' }] : []),
    ...(isAdmin ? [{ key: 'sources', label: 'Источники' }] : []),
  ];

  return (
    <Box className="container" sx={{ maxWidth: 820, mx: 'auto', p: { xs: 1, md: 2 } }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Новости</Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        {tabs.map(t => (
          <Tab key={t.key} value={t.key} label={t.label} />
        ))}
      </Tabs>

      {tab === 'feed' && (
        <>
          <NewsFilters
            facets={facets}
            category={category}
            setCategory={setCategory}
            tag={tag}
            setTag={setTag}
            personalized={personalized}
            setPersonalized={setPersonalized}
            disabledPersonalized={!isLoggedIn}
          />
          {!isLoggedIn && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Войдите в аккаунт, чтобы видеть персональную ленту. Сейчас показана общая лента по дате.
            </Typography>
          )}

          {loading && items.length === 0 ? (
            <Stack alignItems="center" sx={{ py: 4 }}><CircularProgress /></Stack>
          ) : (
            <>
              {items.map(it => (
                <NewsCard key={it._id || it.link} item={it} />
              ))}
              {items.length === 0 && !loading && (
                <Typography color="text.secondary">Новостей пока нет. Источники обрабатываются автоматически.</Typography>
              )}
            </>
          )}

          {hasMore && (
            <Stack alignItems="center" sx={{ py: 2 }}>
              <Button onClick={loadMore} disabled={loading}>Загрузить ещё</Button>
            </Stack>
          )}
        </>
      )}

      {tab === 'interests' && <InterestSettings />}
      {tab === 'sources' && <AdminSources />}
    </Box>
  );
};
