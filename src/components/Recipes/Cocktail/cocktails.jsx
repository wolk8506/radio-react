import React from 'react';

import { Link } from 'react-router-dom';
import { data_coctail } from '../data/data_coctail';

import s from './cocktail.module.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Coctails = () => {
  const menuCoctails = data_coctail.map(i => (
    <Link className={s.menuItem} key={i.id} to={`/cocktails/${i.id}`}>
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
          Коктейли
        </h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuCoctails}
        </List>
      </div>
    </>
  );
};
