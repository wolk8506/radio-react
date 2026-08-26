import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { authSelectors } from 'store';
import { LibraryAdmin } from 'components/Profile/LibraryAdmin';
import { Button } from '@mui/material';

const LABELS = { events: 'События', facts: 'Факты', jokes: 'Шутки' };

export const LibraryPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const isAdmin = useSelector(authSelectors.getIsAdmin);

  if (!isAdmin || !LABELS[type]) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="container-user">
      <nav className="navigation">
        <span className="user__name">Управление: {LABELS[type]}</span>
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate('/profile', { replace: true })}
        >
          Назад
        </Button>
      </nav>
      <div className="container-user__block">
        <LibraryAdmin type={type} />
      </div>
    </div>
  );
};
