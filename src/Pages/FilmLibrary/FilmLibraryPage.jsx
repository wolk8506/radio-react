import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import AddIcon from '@mui/icons-material/Add';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';

import { authSelectors } from 'store';
import { libraryService } from './libraryService';
import { FolderCard, EmptyFolderArt } from './FilmUI';

export const FilmLibraryPage = () => {
  const userId = useSelector(authSelectors.getUserID);
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPublic, setNewPublic] = useState(false);

  const isMine = c => !c.ownerId || c.ownerId === userId;

  useEffect(() => {
    let mounted = true;
    libraryService
      .getCollections()
      .then(data => mounted && setCollections(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const created = await libraryService.createCollection(newName, newPublic);
    setCollections(prev => [...prev, created]);
    setCreateOpen(false);
    setNewName('');
    setNewPublic(false);
    toast.success('Подборка создана');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="conteiner" sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <MovieFilterOutlinedIcon color="primary" />
        <Typography variant="h4" component="h1">
          Медиатека
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ваши подборки фильмов. Откройте папку, чтобы посмотреть фильмы или добавить новые.
      </Typography>

      <Button startIcon={<AddIcon />} variant="contained" sx={{ mb: 3 }} onClick={() => setCreateOpen(true)}>
        Создать подборку
      </Button>

      {collections.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <EmptyFolderArt size={120} />
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            У вас пока нет подборок
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Создайте первую подборку и добавляйте в неё фильмы.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Создать подборку
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(auto-fill, minmax(180px, 1fr))',
            },
            gap: 2,
          }}
        >
          {collections.map(c => (
            <FolderCard
              key={c.id}
              collection={c}
              isMine={isMine(c)}
              onClick={() => navigate(`/filmLibrary/${c.id}`)}
            />
          ))}
        </Box>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Новая подборка</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Название подборки"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <FormControlLabel
            control={
              <Switch checked={newPublic} onChange={e => setNewPublic(e.target.checked)} />
            }
            label="Общая подборка (видна всем пользователям)"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!newName.trim()}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
