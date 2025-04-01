import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_desert } from '../data/data_desert';

import s from '../group.module.css';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Deserts = () => {
  const menuItem = data_desert.map(i => (
    <Link className={s.menuItem} key={i.id} to={`/desert/${i.id}`}>
      <ListItem button>
        <ListItemText primary={i.name} />
      </ListItem>
    </Link>
  ));
  return (
    <>
      <div className="container container-recipes">
        <h1>Десерты</h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuItem}
        </List>
      </div>
    </>
  );
};
