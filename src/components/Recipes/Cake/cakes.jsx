import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_cake } from '../data/data_cake';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import { IconVypechka } from '../img/icon_4';

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
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
            <IconVypechka className="breadcrumb-icon-activ" />
            Выпечка
          </Typography>
        </Breadcrumbs>
        <h1>Кексы/торты</h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuCakes}
        </List>
      </div>
    </>
  );
};
