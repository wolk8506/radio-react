import { Link } from 'react-router-dom';

import sprite from './sprite.svg';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

export const RecipesIndex = () => {
  const menuList = [
    { name: 'Первые блюда', svgId: '#icon-soup', link: '/soup', key: 0 },
    { name: 'Вторые блюда', svgId: '#icon-meat', link: '/meat', key: 1 },
    { name: 'Салаты', svgId: '#icon-salad', link: '/salad', key: 2 },
    { name: 'Закуски', svgId: '#icon-zakuski', link: '/zakuski', key: 3 },
    { name: 'Выпечка', svgId: '#icon-cake', link: '/cake', key: 4 },
    // { name: 'Десерты', svgId: '#icon-desert', link: '/desert', key: 5 },
    { name: 'Коктейли', svgId: '#icon-cocktail', link: '/cocktail', key: 6 },
    // { name: 'Соусы', svgId: '#icon-sousy', link: '/sousy', key: 7 },
    // { name: 'Заготовки на зиму', svgId: '#icon-zagotovki', link: '/zagotovki', key: 8 },
  ];
  return (
    <>
      <div
        className="container-recipes"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
          textTransform: 'uppercase',
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Typography>
        </Breadcrumbs>

        <ul className="menu-list">
          {menuList.map(i => {
            return (
              <li className="menu-item" key={i.key}>
                <Link to={i.link}>
                  <svg className="icon" width="36" height="36">
                    <use href={`${sprite}${i.svgId}`}></use>
                  </svg>
                  {i.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
