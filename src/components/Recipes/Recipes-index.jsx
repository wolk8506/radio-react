import { Link } from 'react-router-dom';

import sprite from './sprite.svg';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

export const RecipesIndex = () => {
  return (
    <>
      <div
        className="container container-recipes"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
          fontSize: 40,
          textTransform: 'uppercase',
          color: '#ffffff',
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Typography>
        </Breadcrumbs>

        <ul className="menu-list">
          <li className="menu-item">
            <Link className="linck-people" to="/soup">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-soup`}></use>
              </svg>
              Первые блюда
            </Link>
          </li>
          <li className="menu-item">
            <Link className="linck-people" to="/meat">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-meat`}></use>
              </svg>
              Вторые блюда
            </Link>
          </li>

          <li className="menu-item">
            <Link className="linck-people" to="/salad">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-salad`}></use>
              </svg>
              Салаты
            </Link>
          </li>
          <li className="menu-item">
            <Link className="linck-people" to="/zakuski">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-zakuski`}></use>
              </svg>
              Закуски
            </Link>
          </li>

          <li className="menu-item">
            <Link className="linck-people" to="/cake">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-cake`}></use>
              </svg>
              Выпечка
            </Link>
          </li>

          <li className="menu-item">
            <Link className="linck-people" to="/desert">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-desert`}></use>
              </svg>
              Десерты
            </Link>
          </li>

          <li className="menu-item">
            <Link className="linck-people" to="/cocktail">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-cocktail`}></use>
              </svg>
              Коктейли
            </Link>
          </li>
          <li className="menu-item">
            <Link className="linck-people" to="/sousy">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-sousy`}></use>
              </svg>
              Соусы
            </Link>
          </li>
          <li className="menu-item">
            <Link className="linck-people" to="/zagotovki">
              <svg className="icon" width="36" height="36">
                <use href={`${sprite}#icon-zagotovki`}></use>
              </svg>
              Заготовки на зиму
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
