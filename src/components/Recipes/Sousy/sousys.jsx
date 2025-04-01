import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_sousy } from '../data/data_sousy';

import s from '../group.module.css';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Sousys = () => {
  const menuItem = data_sousy.map(i => (
    <Link className={s.menuItem} key={i.id} to={`/sousy/${i.id}`}>
      <ListItem button>
        <ListItemText primary={i.name} />
      </ListItem>
    </Link>
  ));
  return (
    <>
      <div className="container container-recipes">
        <h1>Соусы</h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuItem}
        </List>
      </div>
    </>
  );
};
