import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_cake } from '../data/data_cake';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import s from './cakes.module.css';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Cakes = () => {
  const menuCakes = data_cake.map(i => (
    <Link className={s.menuItem} key={i.id} to={`/cakes/${i.id}`}>
      <ListItem button>
        <ListItemText primary={i.name} />
      </ListItem>
    </Link>
  ));
  return (
    <>
      <div className="container container-recipes">
        <h1>
          <Link className="link" to="/recipes">
            <ArrowBackIcon />
          </Link>
          Кексы/торты
        </h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuCakes}
        </List>
      </div>
    </>
  );
};
