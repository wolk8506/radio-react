import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

import { authSelectors } from 'store';
import { libraryService } from './libraryService';
import { tmdbService } from './tmdbService';
import { MovieCard, MovieDetailsModal, AddMovieDialog } from './FilmUI';

export const CollectionPage = () => {
  const { collectionId } = useParams();
  const userId = useSelector(authSelectors.getUserID);
  const navigate = useNavigate();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);

  const [addOpen, setAddOpen] = useState(false);
  const [detailsMovie, setDetailsMovie] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const [filter, setFilter] = useState('all'); // all | watched | unwatched
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState(null);
  const [deleteCollOpen, setDeleteCollOpen] = useState(false);

  const dragIndex = React.useRef(null);

  const genreMap = useMemo(() => {
    const map = {};
    genres.forEach(g => (map[g.id] = g.name));
    return map;
  }, [genres]);

  const isWatched = m => !!(m.watchedBy && m.watchedBy.includes(userId));

  const visibleMovies = (collection?.movies || []).filter(m => {
    if (filter === 'watched') return isWatched(m);
    if (filter === 'unwatched') return !isWatched(m);
    return true;
  });

  // ----- Drag & Drop: изменение порядка фильмов -----
  const handleDragStart = (e, movieId) => {
    dragIndex.current = movieId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(movieId));
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetId) => {
    e.preventDefault();
    const fromId = dragIndex.current;
    dragIndex.current = null;
    if (!fromId || fromId === targetId || !collection) return;
    const movies = [...collection.movies];
    const fromIdx = movies.findIndex(m => m.id === fromId);
    if (fromIdx === -1) return;
    const [moved] = movies.splice(fromIdx, 1);
    const toIdx = movies.findIndex(m => m.id === targetId);
    movies.splice(toIdx, 0, moved);
    try {
      const updated = await libraryService.reorderMovies(
        collectionId,
        movies.map(m => m.id),
      );
      setCollection(updated);
    } catch {
      toast.error('Не удалось изменить порядок');
    }
  };

  const handleToggleWatched = async (movieId, watched) => {
    try {
      const updated = await libraryService.setWatched(collectionId, movieId, watched);
      setCollection(updated);
    } catch {
      toast.error('Не удалось обновить статус');
    }
  };

  const requestRemove = movie => {
    setMovieToRemove(movie);
    setConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if (!movieToRemove) return;
    try {
      const updated = await libraryService.removeMovie(collectionId, movieToRemove.id);
      setCollection(updated);
      toast.info('Фильм удалён из подборки');
    } catch {
      toast.error('Не удалось удалить фильм');
    } finally {
      setConfirmOpen(false);
      setMovieToRemove(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    tmdbService.getGenres().then(data => mounted && setGenres(data)).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    libraryService
      .getCollections()
      .then(data => {
        if (!mounted) return;
        const found = data.find(c => c.id === collectionId) || null;
        setCollection(found);
        setLoading(false);
        if (!found) toast.error('Подборка не найдена');
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId, collectionId]);

  const handleRename = async () => {
    if (!renameValue.trim()) return;
    const updated = await libraryService.renameCollection(collectionId, renameValue);
    setCollection(updated);
    setRenameOpen(false);
    toast.success('Подборка переименована');
  };

  const handleDelete = () => {
    setDeleteCollOpen(true);
  };

  const confirmDeleteCollection = async () => {
    try {
      await libraryService.deleteCollection(collectionId);
      toast.info('Подборка удалена');
      setDeleteCollOpen(false);
      navigate('/filmLibrary');
    } catch {
      toast.error('Не удалось удалить подборку');
      setDeleteCollOpen(false);
    }
  };

  const handleTogglePublic = async () => {
    try {
      const updated = await libraryService.setPublic(collectionId, !collection.isPublic);
      setCollection(updated);
      toast.success(updated.isPublic ? 'Подборка стала общей' : 'Подборка стала личной');
    } catch {
      toast.error('Не удалось изменить доступность');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!collection) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Подборка не найдена.</Typography>
        <Button onClick={() => navigate('/filmLibrary')} sx={{ mt: 2 }}>
          К списку подборок
        </Button>
      </Box>
    );
  }

  const isMine = !collection.ownerId || collection.ownerId === userId;

  return (
    <Box className="conteiner" sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/filmLibrary')} sx={{ mb: 2 }}>
        Назад к подборкам
      </Button>

      <Stack
        // className="block"
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4" component="h1">
            {collection.name}
          </Typography>
          <Chip
            icon={collection.isPublic ? <PublicIcon /> : <LockIcon />}
            label={collection.isPublic ? 'общая' : 'личная'}
            size="small"
            color={collection.isPublic ? 'info' : 'default'}
            {...(isMine && {
              onClick: () => handleTogglePublic(),
              sx: { cursor: 'pointer' },
              title: collection.isPublic ? 'Сделать личной' : 'Сделать общей',
            })}
          />
          {!isMine && <Chip label="чужая подборка" size="small" variant="outlined" />}
        </Stack>
        <Stack direction="row" spacing={1}>
          {isMine && (
            <Button size="small" startIcon={<AddIcon />} variant="contained" onClick={() => setAddOpen(true)}>
              Добавить фильм
            </Button>
          )}
          {isMine && (
            <Tooltip title="Переименовать">
              <IconButton
                onClick={() => {
                  setRenameValue(collection.name);
                  setRenameOpen(true);
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          {isMine && (
            <Tooltip title="Удалить подборку">
              <IconButton color="error" onClick={handleDelete}>
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {collection.movies.length > 0 && (
        <ToggleButtonGroup
          value={filter}
          exclusive
          size="small"
          onChange={(_, val) => val && setFilter(val)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all">Все</ToggleButton>
          <ToggleButton value="watched">Просмотрено</ToggleButton>
          <ToggleButton value="unwatched">Не просмотрено</ToggleButton>
        </ToggleButtonGroup>
      )}

      {collection.movies.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4 }}>
          В этой подборке пока нет фильмов. Нажмите «Добавить фильм».
        </Typography>
      ) : visibleMovies.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4 }}>
          Нет фильмов в выбранном фильтре.
        </Typography>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {isMine
              ? 'Перетащите карточку, чтобы изменить порядок фильмов.'
              : 'Это общая подборка другого пользователя. Вы можете отмечать фильмы как просмотренные (видно только вам).'}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(auto-fill, minmax(170px, 1fr))',
              },
              gap: 2,
            }}
          >
            {visibleMovies.map(m => (
              <Box
                key={m.id}
                draggable={isMine}
                onDragStart={e => handleDragStart(e, m.id)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, m.id)}
                sx={{ cursor: isMine ? 'grab' : 'default', '&:active': { cursor: isMine ? 'grabbing' : 'default' } }}
              >
                <MovieCard
                  movie={m}
                  genreMap={genreMap}
                  watched={!!(m.watchedBy && m.watchedBy.includes(userId))}
                  onToggleWatched={handleToggleWatched}
                  dragHandle={
                    isMine ? (
                      <DragIndicatorIcon
                        fontSize="small"
                        sx={{ position: 'absolute', top: 4, left: 4, color: '#fff', opacity: 0.8 }}
                      />
                    ) : null
                  }
                  onOpen={() => {
                    setDetailsMovie(m);
                    setDetailsOpen(true);
                  }}
                  onRemove={isMine ? () => requestRemove(m) : undefined}
                />
              </Box>
            ))}
          </Box>
        </>
      )}

      <AddMovieDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        collectionId={collectionId}
        userId={userId}
        existingIds={collection.movies.map(m => m.id)}
        onAdded={() => {
          libraryService.getCollections().then(data => {
            const found = data.find(c => c.id === collectionId);
            if (found) setCollection(found);
          });
        }}
      />

      <MovieDetailsModal open={detailsOpen} movie={detailsMovie} onClose={() => setDetailsOpen(false)} />

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} fullWidth maxWidth="xs" disableScrollLock>
        <DialogTitle>Переименовать подборку</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Название подборки"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRename()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleRename} disabled={!renameValue.trim()}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" disableScrollLock>
        <DialogTitle>Удалить фильм?</DialogTitle>
        <DialogContent>
          <Typography>
            Фильм «{movieToRemove?.title}» будет удалён из подборки «{collection?.name}».
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={confirmRemove}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteCollOpen} onClose={() => setDeleteCollOpen(false)} maxWidth="xs" disableScrollLock>
        <DialogTitle>Удалить подборку?</DialogTitle>
        <DialogContent>
          <Typography>Подборка «{collection?.name}» будет удалена безвозвратно вместе со всеми фильмами.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCollOpen(false)}>Отмена</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteCollection}>
            Удалить подборку
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
