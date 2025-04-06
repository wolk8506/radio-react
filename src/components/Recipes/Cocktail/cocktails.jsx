import React from 'react';

import { Link } from 'react-router-dom';
import { data_coctail } from '../data/data_coctail';

import s from './cocktail.module.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import { IconNapitki } from '../img/icon_8';

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
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
            <IconNapitki className="breadcrumb-icon-activ" />
            Коктейли
          </Typography>
        </Breadcrumbs>
        <h1>Коктейли</h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuCoctails}
        </List>
      </div>
    </>
  );
};
