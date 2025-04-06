import { Link, useLocation } from 'react-router-dom';
import { data_cake } from '../data/data_cake';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import { IconVypechka } from '../img/icon_4';

export const Cake = () => {
  const location = useLocation();
  const CAKE_ID = Number(location.pathname.slice(7)) - 1;
  //   console.log(CAKE_ID);
  const cake = data_cake[CAKE_ID];

  return (
    <>
      <div className="container container-recipes">
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/cakes">
            <IconVypechka className="breadcrumb-icon" />
            Выпечка
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>{cake.name}</Typography>
        </Breadcrumbs>
        <h2>{cake.name}</h2>

        <img src={cake.img} alt={cake.name} width={412} />
        <h3>ИНГРЕДИЕНТЫ</h3>
        <ul>
          {cake.ingredients &&
            cake.ingredients.map(i => (
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
          {cake.steps.map(i => (
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
