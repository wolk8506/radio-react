import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';

import { authSelectors } from 'store';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { AdminUsers } from 'components/Profile/AdminUsers';

export const AdminUsersPage = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector(authSelectors.getIsAdmin);

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="container-user">
      <nav className="navigation">
        <span className="user__name">Управление пользователями</span>
        <Button
          type="button"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/profile', { replace: true })}
        >
          Назад
        </Button>
      </nav>
      <div className="container-user__block">
        <AdminUsers />
      </div>
    </div>
  );
};
