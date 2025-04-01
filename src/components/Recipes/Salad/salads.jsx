import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_salad } from '../data/data_salad';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Salads = () => {
  const menuItem = data_salad.map(i => (
    <Link className="menu-item" key={i.id} to={`/salad/${i.id}`}>
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
          Салаты
        </h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuItem}
        </List>
      </div>
    </>
  );
};
