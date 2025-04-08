import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import sprite from './sprite.svg';

import { data_cake as cake } from './data/data_cake';
import { data_soup as soup } from './data/data_soup';
import { data_cocktail as cocktail } from './data/data_cocktail';
import { data_desert as desert } from './data/data_desert';
import { data_meat as meat } from './data/data_meat';
import { data_salad as salad } from './data/data_salad';
import { data_sousy as sousy } from './data/data_sousy';
import { data_zagotovki as zagotovki } from './data/data_zagotovki';
import { data_zakuski as zakuski } from './data/data_zakuski';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Cakes = () => {
  const location = useLocation();
  const item_ID = location.pathname.split('/')[1];
  const data = { cake, soup, cocktail, desert, meat, salad, sousy, zagotovki, zakuski };
  const pageName = {
    cake: 'Выпечка',
    soup: 'Первые блюда',
    cocktail: 'Коктейли',
    desert: 'Десерты',
    meat: 'Вторые блюда',
    salad: 'Салаты',
    sousy: 'Соусы',
    zagotovki: 'Заготовки на зиму',
    zakuski: 'Закуски',
  };

  const menuCakes = data[item_ID].map(i => (
    <Link className="menu-item recipes__menu-item" key={i.id} to={`/${item_ID}/${i.id}`}>
      <ListItem button>
        <img src={i.img} alt={i.name} width={64} />
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
            <svg className="icon" width="24" height="24">
              {'soup' === item_ID && <use href={`${sprite}#icon-soup`}></use>}
              {'meat' === item_ID && <use href={`${sprite}#icon-meat`}></use>}
              {'salad' === item_ID && <use href={`${sprite}#icon-salad`}></use>}
              {'zakuski' === item_ID && <use href={`${sprite}#icon-zakuski`}></use>}
              {'cake' === item_ID && <use href={`${sprite}#icon-cake`}></use>}
              {'desert' === item_ID && <use href={`${sprite}#icon-desert`}></use>}
              {'cocktail' === item_ID && <use href={`${sprite}#icon-cocktail`}></use>}
              {'sousy' === item_ID && <use href={`${sprite}#icon-sousy`}></use>}
              {'zagotovki' === item_ID && <use href={`${sprite}#icon-zagotovki`}></use>}
            </svg>
            {pageName[item_ID]}
          </Typography>
        </Breadcrumbs>
        <h1>{pageName[item_ID]}</h1>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menuCakes}
        </List>
      </div>
    </>
  );
};
