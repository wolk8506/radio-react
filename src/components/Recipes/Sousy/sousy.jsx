import { Link, useLocation } from 'react-router-dom';
import { data_sousy } from '../data/data_sousy';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import { IconSousy } from '../img/icon_9';

export const Sousy = () => {
  const location = useLocation();
  const ITEM_ID = Number(location.pathname.slice(7)) - 1;
  const item = data_sousy[ITEM_ID];

  return (
    <>
      <div className="container container-recipes">
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/sousy">
            <IconSousy className="breadcrumb-icon" />
            Соусы
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>{item?.name}</Typography>
        </Breadcrumbs>
        <h2>{item.name}</h2>

        <img src={item.img} alt={item.name} width={412} />
        <h3>ИНГРЕДИЕНТЫ</h3>
        <ul>
          {item.ingredients &&
            item.ingredients.map(i => (
              <li key={i.i_name}>
                <p className="item">
                  <span className="i-name">{i.i_name}</span>
                  <span className="bracket-line"></span>
                  <span className="i-weight">{i.i_weight}</span>
                </p>
              </li>
            ))}
        </ul>
        <h3>ПОШАГОВЫЙ РЕЦЕПТ ПРИГОТОВЛЕНИЯ</h3>
        <ol>
          {item.steps.map(i => (
            <li className="item-step" key={i.step}>
              {i.img && <img className="image-step" src={i.img} alt="" width={200} />}
              <p className="item">{i.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};
