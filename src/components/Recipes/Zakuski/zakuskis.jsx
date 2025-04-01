import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_zakuski } from '../data/data_zakuski';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import s from '../group.module.css';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Zakuskis = () => {
  const menuItem = data_zakuski.map(i => (
    <Link className={s.menuItem} key={i.id} to={`/zakuski/${i.id}`}>
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
          Закуски
        </h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuItem}
        </List>
      </div>
    </>
  );
};
