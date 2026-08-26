import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authSelectors, authOperations } from 'store';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { toast } from 'react-toastify';

import moment from 'moment';

export const AdminUsers = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(authSelectors.getUserID);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await dispatch(authOperations.fetchAdminUsers()).unwrap();
      setUsers(list);
    } catch {
      toast.error('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleRole = async id => {
    setBusyId(id);
    try {
      const { isAdmin } = await dispatch(authOperations.toggleUserAdmin(id)).unwrap();
      setUsers(prev => prev.map(u => (u._id === id ? { ...u, isAdmin } : u)));
      toast.success(isAdmin ? 'Права администратора выданы' : 'Права администратора сняты');
    } catch {
      toast.error('Не удалось изменить права пользователя');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async id => {
    if (id === currentUserId) {
      toast.warn('Нельзя удалить собственную учётную запись');
      return;
    }
    setBusyId(id);
    try {
      await dispatch(authOperations.deleteUserById(id)).unwrap();
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('Пользователь удалён');
    } catch {
      toast.error('Не удалось удалить пользователя');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleVerify = async id => {
    setBusyId(id);
    try {
      const { verify } = await dispatch(authOperations.toggleUserVerify(id)).unwrap();
      setUsers(prev => prev.map(u => (u._id === id ? { ...u, verify } : u)));
      toast.success(verify ? 'Пользователь подтверждён' : 'Подтверждение снято');
    } catch {
      toast.error('Не удалось изменить статус пользователя');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="block__admin-users" style={{ marginTop: '48px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Управление пользователями
      </Typography>

      {loading ? (
        <CircularProgress sx={{ color: 'var(--color-02)' }} />
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Регистрация</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => {
                const isSelf = u._id === currentUserId;
                return (
                  <TableRow key={u._id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.verify ? (
                        <span style={{ color: 'var(--color-02)' }}>активен</span>
                      ) : (
                        <span style={{ color: '#e57373' }}>ожидает подтверждения</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.isAdmin ? (
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'var(--color-02)' }}>
                          <AdminPanelSettingsIcon fontSize="small" /> админ
                        </Box>
                      ) : (
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon fontSize="small" /> пользователь
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.createdAt ? moment(u.createdAt).format('DD.MM.YYYY') : '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={isSelf ? 'Недоступно для себя' : u.verify ? 'Снять подтверждение' : 'Подтвердить пользователя'}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={isSelf || busyId === u._id}
                            onClick={() => handleToggleVerify(u._id)}
                          >
                            <VerifiedUserIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={isSelf ? 'Недоступно для себя' : u.isAdmin ? 'Снять права админа' : 'Сделать админом'}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={isSelf || busyId === u._id}
                            onClick={() => handleToggleRole(u._id)}
                          >
                            <AdminPanelSettingsIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={isSelf ? 'Нельзя удалить себя' : 'Удалить пользователя'}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={isSelf || busyId === u._id}
                            onClick={() => handleDelete(u._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 2 }}>
        <Button type="button" variant="text" onClick={loadUsers} sx={{ textTransform: 'none' }}>
          Обновить список
        </Button>
      </Box>
    </div>
  );
};
