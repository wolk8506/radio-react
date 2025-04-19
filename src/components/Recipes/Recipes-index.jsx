import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from '../../store/auth/selectors';
import { setStatusAddRecipe } from 'store/recipe/actions';
import sprite from './sprite.svg';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const RecipesIndex = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);

  const menuList = [
    { name: 'Первые блюда', svgId: '#icon-soup', link: '/recipes/soup', key: 0 },
    { name: 'Вторые блюда', svgId: '#icon-meat', link: '/recipes/meat', key: 1 },
    { name: 'Салаты', svgId: '#icon-salad', link: '/recipes/salad', key: 2 },
    { name: 'Закуски', svgId: '#icon-zakuski', link: '/recipes/zakuski', key: 3 },
    { name: 'Выпечка', svgId: '#icon-cake', link: '/recipes/cake', key: 4 },
    // { name: 'Десерты', svgId: '#icon-desert', link: '/recipes/desert', key: 5 },
    { name: 'Коктейли', svgId: '#icon-cocktail', link: '/recipes/cocktail', key: 6 },
    // { name: 'Соусы', svgId: '#icon-sousy', link: '/recipes/sousy', key: 7 },
    // { name: 'Заготовки на зиму', svgId: '#icon-zagotovki', link: '/recipes/zagotovki', key: 8 },
    // { name: 'add', svgId: '#icon-zagotovki', link: '/recipes/zagotovki', key: 8 },
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
        <div className="header">
          <Breadcrumbs aria-label="breadcrumb">
            <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
              <FastfoodIcon sx={{ mr: 0.5 }} />
              Рецепты
            </Typography>
          </Breadcrumbs>
        </div>

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
          {isLoggedIn && (
            <li className="menu-item">
              <Link
                to="/recipes/recipes-add"
                onClick={() => {
                  dispatch(setStatusAddRecipe());
                }}
              >
                <AddCircleOutlineIcon />
                Добавить рецепт
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};
