import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';

import { tmdbService, getPosterUrl, PLACEHOLDER } from './tmdbService';

// ---------- Пустая папка: кастомная иллюстрация ----------
export const EmptyFolderArt = ({ size = 96 }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
    <rect x="10" y="30" width="76" height="52" rx="8" fill="#2a2f3a" />
    <path d="M10 38c0-4.4 3.6-8 8-8h14l6 8h40c4.4 0 8 3.6 8 8v4H10V38z" fill="#3a4150" />
    <circle cx="48" cy="60" r="14" fill="#1d2230" />
    <path d="M43 53l13 7-13 7V53z" fill="#9b8cff" />
  </svg>
);

// ---------- Карточка-папка (подборка) с веером постеров ----------
export const FolderCard = ({ collection, genreMap, onClick, isMine }) => {
  const movies = collection.movies || [];
  const preview = movies.slice(0, 3);

  const angles = useMemo(() => {
    if (preview.length === 1) return [0];
    if (preview.length === 2) return [-9, 9];
    return [-13, 0, 13];
  }, [preview.length]);

  return (
    <Card
      className="conteiner"
      sx={{
        width: '100%',
        height: 230,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform .15s, box-shadow .15s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        {!isMine && (
          <Chip
            icon={<PublicIcon />}
            label="общая"
            size="small"
            color="info"
            sx={{ position: 'absolute', top: 6, left: 6, zIndex: 6 }}
          />
        )}
        {preview.length === 0 ? (
          <EmptyFolderArt size={100} />
        ) : (
          <Box sx={{ position: 'relative', width: 80, height: 150 }}>
            {preview.map((m, i) => (
              <Box
                key={m.id}
                component="img"
                src={m.poster_path ? getPosterUrl(m.poster_path) : PLACEHOLDER}
                alt={m.title}
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  width: 66,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 1,
                  boxShadow: 3,
                  transform: `translateX(-50%) rotate(${angles[i]}deg) ${
                    i === preview.length - 1 ? 'translateZ(0)' : ''
                  }`,
                  transformOrigin: 'bottom center',
                  zIndex: i,
                }}
              />
            ))}
            {movies.length > 3 && (
              <Chip
                label={`+${movies.length - 3}`}
                size="small"
                color="primary"
                sx={{ position: 'absolute', bottom: 0, right: -6, zIndex: 5 }}
              />
            )}
          </Box>
        )}
      </Box>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {collection.isPublic ? (
            <PublicIcon sx={{ fontSize: 16, color: 'info.main' }} />
          ) : (
            <LockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          )}
          <Typography variant="subtitle1" noWrap title={collection.name} sx={{ flex: 1 }}>
            {collection.name}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {movies.length === 0
            ? 'Пусто'
            : `${movies.length} ${movies.length === 1 ? 'фильм' : 'фильмов'}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ---------- Карточка фильма внутри подборки ----------
export const MovieCard = ({ movie, genreMap, onOpen, onRemove, dragHandle, watched, onToggleWatched }) => {
  const names = (movie.genre_ids || []).map(id => genreMap[id]).filter(Boolean);
  const genreText =
    names.length > 3 ? `${names.slice(0, 3).join(', ')}, other` : names.join(', ');
  return (
    <Card sx={{ position: 'relative', cursor: 'pointer' }} onClick={onOpen}>
      {dragHandle}
      {watched && (
        <Chip
          icon={<CheckCircleIcon />}
          label="просмотрено"
          size="small"
          color="success"
          sx={{ position: 'absolute', bottom: 105, right: 5, zIndex: 2 }}
        />
      )}
      <Box
        component="img"
        src={movie.poster_path ? getPosterUrl(movie.poster_path) : PLACEHOLDER}
        alt={movie.title}
        sx={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
      />
      {onRemove && (
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            '&:hover': { bgcolor: 'error.main' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="subtitle2" noWrap title={movie.title}>
          {movie.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" noWrap>
          {genreText || '—'} | {movie.release_date?.slice(0, 4) || '—'}
        </Typography>
        {onToggleWatched && (
          <Tooltip title={watched ? 'Снять отметку' : 'Отметить просмотренным'}>
            <IconButton
              size="small"
              color={watched ? 'success' : 'default'}
              onClick={e => {
                e.stopPropagation();
                onToggleWatched(movie.id, !watched);
              }}
              sx={{ mt: 0.5, ml: -1 }}
            >
              {watched ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <CheckCircleOutlineIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
};

// ---------- Модалка с видео (отдельная) ----------
export const VideoModal = ({ open, video, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableScrollLock>
    <IconButton
      onClick={onClose}
      sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, color: '#fff' }}
    >
      <CloseIcon />
    </IconButton>
    <DialogContent sx={{ p: 0, bgcolor: '#000' }}>
      <Box sx={{ position: 'relative', pt: '56.25%' }}>
        {video && (
          <iframe
            src={`https://www.youtube.com/embed/${video.key}`}
            title={video.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
          />
        )}
      </Box>
    </DialogContent>
  </Dialog>
);

// ---------- Модалка с подробностями о фильме ----------
export const MovieDetailsModal = ({ open, movie, onClose, onAdd, alreadyAdded }) => {
  const [video, setVideo] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [genreText, setGenreText] = useState('—');

  useEffect(() => {
    if (!open || !movie) return;
    let mounted = true;
    setLoadingVideo(true);
    setVideo(null);
    setVideoOpen(false);
    setGenreText('—');

    tmdbService
      .getVideos(movie.id, movie.media_type || 'movie')
      .then(v => mounted && setVideo(v))
      .catch(() => {})
      .finally(() => mounted && setLoadingVideo(false));

    tmdbService
      .getGenres()
      .then(genres => {
        if (!mounted) return;
        const map = {};
        genres.forEach(g => (map[g.id] = g.name));
        const names = (movie.genre_ids || []).map(id => map[id]).filter(Boolean);
        setGenreText(names.join(', ') || '—');
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [open, movie]);

  if (!movie) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableScrollLock>
      <DialogContent sx={{ p: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2 }}>
          <Box
            component="img"
            src={movie.poster_path ? getPosterUrl(movie.poster_path) : PLACEHOLDER}
            alt={movie.title}
            sx={{ width: { xs: '100%', sm: 220 }, borderRadius: 2, objectFit: 'cover' }}
          />
          <Box className="block" sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom className="color-text">
              {movie.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {movie.release_date?.slice(0, 4) || '—'} · {genreText}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Rating value={(movie.vote_average || 0) / 2} precision={0.1} readOnly size="small" />
              <Typography variant="body2">{movie.vote_average?.toFixed(1) || '—'}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {movie.overview || 'Описание отсутствует.'}
            </Typography>
            {onAdd && (
              <Button
                variant={alreadyAdded ? 'outlined' : 'contained'}
                startIcon={alreadyAdded ? <CheckIcon /> : <AddIcon />}
                sx={{ mt: 2 }}
                disabled={alreadyAdded}
                onClick={onAdd}
              >
                {alreadyAdded ? 'Уже в подборке' : 'Добавить в подборку'}
              </Button>
            )}
          </Box>
        </Stack>

        <Stack justifyContent="space-between" flexDirection="row" sx={{ px: 2, pb: 2 }}>
          <Box>
            {loadingVideo ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                <CircularProgress size={24} />
              </Box>
            ) : video ? (
              <Button variant="outlined" startIcon={<PlayCircleOutlineIcon />} onClick={() => setVideoOpen(true)}>
                Смотреть трейлер
              </Button>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Видео недоступно.
              </Typography>
            )}
          </Box>
          <Button variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
        </Stack>
      </DialogContent>
      <VideoModal open={videoOpen} video={video} onClose={() => setVideoOpen(false)} />
    </Dialog>
  );
};

// ---------- Нормализация результата (фильм/сериал) ----------
const normalizeResult = m => {
  const isTv = !m.title && !!m.name;
  return {
    ...m,
    media_type: isTv ? 'tv' : 'movie',
    title: m.title || m.name || '',
    release_date: m.release_date || m.first_air_date || '',
  };
};

// ---------- Диалог поиска и добавления фильма ----------
export const AddMovieDialog = ({ open, onClose, collectionId, userId, onAdded, existingIds = [] }) => {
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('movie');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [detailsMovie, setDetailsMovie] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

  const runSearch = useCallback(
    async (q, mt, p = 1) => {
      setLoading(true);
      try {
        const data = q.trim()
          ? await tmdbService.search(q, mt, p)
          : await tmdbService.getPopular(mt, p);
        setResults((data.results || []).map(normalizeResult));
        setTotalPages(data.total_pages || 0);
        setPage(p);
      } catch {
        toast.error('Ошибка поиска фильмов');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Дебаунс ввода (500 мс) + перезапуск при смене типа/открытии
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => runSearch(query, mediaType, 1), 500);
    return () => clearTimeout(timer);
  }, [query, mediaType, open, runSearch]);

  // Сброс состояния только при ОТКРЫТИИ диалога (не при каждом изменении existingIds,
  // иначе после добавления фильма список результатов очищается).
  const didOpen = React.useRef(false);
  useEffect(() => {
    if (open) {
      if (!didOpen.current) {
        setResults([]);
        setAddedIds([...existingIds]);
        setQuery('');
        didOpen.current = true;
      }
    } else {
      didOpen.current = false;
    }
  }, [open, existingIds]);

  const handleAdd = async movie => {
    if (addedIds.includes(movie.id)) {
      toast.info('Фильм уже в этой подборке');
      return;
    }
    await import('./libraryService').then(({ libraryService }) =>
      libraryService.addMovie(collectionId, movie),
    );
    setAddedIds(prev => [...prev, movie.id]);
    toast.success(`«${movie.title}» добавлен`);
    onAdded && onAdded();
  };

  const handleSearchNow = () => runSearch(query, mediaType, 1);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" disableScrollLock>
      <DialogContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder={mediaType === 'tv' ? 'Введите название сериала...' : 'Введите название фильма...'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearchNow()}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearchNow}
            sx={{ minWidth: 120 }}
          >
            Искать
          </Button>
          <ToggleButtonGroup
            value={mediaType}
            exclusive
            size="small"
            onChange={(_, val) => val && setMediaType(val)}
            color="primary"
          >
            <ToggleButton value="movie" aria-label="фильмы">
              <MovieIcon fontSize="small" />
              &nbsp;Фильмы
            </ToggleButton>
            <ToggleButton value="tv" aria-label="сериалы">
              <TvIcon fontSize="small" />
              &nbsp;Сериалы
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : results.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            Ничего не найдено. Попробуйте другой запрос.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 2,
            }}
          >
            {results.map(m => {
              const added = addedIds.includes(m.id);
              return (
                <Card key={`${mediaType}-${m.id}`} sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={m.poster_path ? getPosterUrl(m.poster_path) : PLACEHOLDER}
                    alt={m.title}
                    sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" noWrap title={m.title}>
                      {m.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {m.release_date?.slice(0, 4) || '—'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
                      <Tooltip title="Подробнее">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => {
                            setDetailsMovie(m);
                            setDetailsOpen(true);
                          }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={added ? 'Уже добавлено' : 'Добавить'}>
                        <IconButton
                          size="small"
                          color="primary"
                          disabled={added}
                          onClick={() => handleAdd(m)}
                        >
                          {added ? <CheckIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        {totalPages > 1 && (
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
            <Button size="small" disabled={page <= 1} onClick={() => runSearch(query, mediaType, page - 1)}>
              Назад
            </Button>
            <Typography sx={{ alignSelf: 'center' }}>
              {page} / {Math.min(totalPages, 500)}
            </Typography>
            <Button
              size="small"
              disabled={page >= Math.min(totalPages, 500)}
              onClick={() => runSearch(query, mediaType, page + 1)}
            >
              Вперёд
            </Button>
          </Stack>
        )}
      </DialogContent>

      <MovieDetailsModal
        open={detailsOpen}
        movie={detailsMovie}
        onClose={() => setDetailsOpen(false)}
        onAdd={detailsMovie ? () => handleAdd(detailsMovie) : null}
        alreadyAdded={detailsMovie ? addedIds.includes(detailsMovie.id) : false}
      />
    </Dialog>
  );
};
