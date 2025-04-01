import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_meat } from '../data/data_meat';

import s from './meats.module.css';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Meats = () => {
  const menuCakes = data_meat.map(i => (
    <Link className={s.menuItem} key={i.id} to={`/meat/${i.id}`}>
      <ListItem button>
        <ListItemText primary={i.name} />
      </ListItem>
    </Link>
  ));
  return (
    <>
      <div className="container  container-recipes">
        <h1>Мясные блюда</h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuCakes}
        </List>
      </div>
    </>
  );
};
