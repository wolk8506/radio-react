import { Link, useLocation } from 'react-router-dom';

import { data_cake as cake } from './data/data_cake';
import { data_soup as soup } from './data/data_soup';
import { data_cocktail as cocktail } from './data/data_cocktail';
import { data_desert as desert } from './data/data_desert';
import { data_meat as meat } from './data/data_meat';
import { data_salad as salad } from './data/data_salad';
import { data_sousy as sousy } from './data/data_sousy';
import { data_zagotovki as zagotovki } from './data/data_zagotovki';
import { data_zakuski as zakuski } from './data/data_zakuski';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import sprite from './sprite.svg';

export const Cake = () => {
  const location = useLocation();
  const item_ID = location.pathname.split('/')[1];
  const ID = Number(location.pathname.split('/')[2]) - 1;
  const data = { cake, soup, cocktail, desert, meat, salad, sousy, zagotovki, zakuski };
  const recept = data[item_ID][ID];

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

  return (
    <>
      <div className="container container-recipes">
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>
          <Link sx={{ display: 'flex', alignItems: 'center' }} to={`/${item_ID}`}>
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
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>{recept.name}</Typography>
        </Breadcrumbs>
        <h2>{recept.name}</h2>

        <img src={recept.img} alt={recept.name} width={412} />
        <h3>ИНГРЕДИЕНТЫ</h3>
        <ul>
          {recept.ingredients &&
            recept.ingredients.map(i => (
              <li key={i.i_name}>
                <p className="item">
                  <span className="i-name">{i.i_name}</span>
                  <span className="bracket-line"></span>
                  <span className="i-weight">{i.i_weight}</span>
                </p>
              </li>
            ))}
        </ul>
        {'cocktail' !== item_ID && (
          <>
            <h3>ПОШАГОВЫЙ РЕЦЕПТ ПРИГОТОВЛЕНИЯ</h3>
            <ol>
              {recept.steps.map(i => (
                <li className="item-step" key={i.step}>
                  {i.img && <img className="image-step" src={i.img} alt="" width={200} />}
                  <p className="item">{i.text}</p>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </>
  );
};
