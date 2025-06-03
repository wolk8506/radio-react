import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authSelectors, authOperations } from 'store';
import { BASE_URL } from '../config';

import { Button } from '@mui/material';

import { ProfileAvatar } from 'components/Profile/ProfileAvatar';
import { ProfilePersonData } from 'components/Profile/ProfilePersonData';

export const ProfilePage = () => {
  const dispatch = useDispatch();

  const avatar = useSelector(authSelectors.getAvatar);
  const name = useSelector(authSelectors.getUsername);

  return (
    <div className="container-user">
      <nav className="navigation">
        <div className="navigation__user">
          <img className="user__avatar" src={BASE_URL + avatar} alt="" width="32" />
          <span className="user__name">Привет, {name}</span>
        </div>

        <Button type="button" variant="outlined" onClick={() => dispatch(authOperations.logOut())}>
          Выход
        </Button>
      </nav>
      <div className="container-user__block">
        <ProfileAvatar />
        <ProfilePersonData />
      </div>
    </div>
  );
};
