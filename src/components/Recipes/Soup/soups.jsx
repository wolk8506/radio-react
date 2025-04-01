import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_soup } from '../data/data_soup';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import s from './soups.module.css';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Soups = () => {
  const menuSoup = data_soup.map(i => (
    <Link className={s.menuItem} key={i.id} to={`/soup/${i.id}`}>
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
          Первые блюда
        </h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuSoup}
        </List>
      </div>
    </>
  );
};
