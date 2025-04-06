import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { Link } from 'react-router-dom';
import { data_soup } from '../data/data_soup';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import { IconPrrvyeBlyuda } from '../img/icon_1';

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
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
            <IconPrrvyeBlyuda className="breadcrumb-icon-activ" />
            Первые блюда
          </Typography>
        </Breadcrumbs>
        <h1>Первые блюда</h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuSoup}
        </List>
      </div>
    </>
  );
};
