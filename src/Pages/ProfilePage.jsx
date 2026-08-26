import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { authSelectors, authOperations } from 'store';
import { avatarUrl } from '../config';

import { Button } from '@mui/material';

import { ProfileAvatar } from 'components/Profile/ProfileAvatar';
import { ProfilePersonData } from 'components/Profile/ProfilePersonData';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatar = useSelector(authSelectors.getAvatar);
  const name = useSelector(authSelectors.getUsername);
  const isAdmin = useSelector(authSelectors.getIsAdmin);

  return (
    <div className="container-user">
      <nav className="navigation">
        <div className="navigation__user">
          <img className="user__avatar" src={avatarUrl(avatar)} alt="" width="32" />
          <span className="user__name">Привет, {name}</span>
        </div>

        <div className="navigation__actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {isAdmin && (
            <>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/profile/admin', { replace: true })}
              >
                Управление пользователями
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/profile/library/events', { replace: true })}
              >
                События
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/profile/library/facts', { replace: true })}
              >
                Факты
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/profile/library/jokes', { replace: true })}
              >
                Шутки
              </Button>
            </>
          )}
          <Button type="button" variant="outlined" onClick={() => dispatch(authOperations.logOut())}>
            Выход
          </Button>
        </div>
      </nav>
      <div className="container-user__block">
        <ProfileAvatar />
        <ProfilePersonData />
      </div>
    </div>
  );
};
