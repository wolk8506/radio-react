import { Link, useLocation } from 'react-router-dom';
import { data_coctail } from '../data/data_coctail';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';

import { IconNapitki } from '../img/icon_8';

export const Coctail = () => {
  const location = useLocation();
  const COCTAIL_ID = Number(location.pathname.slice(11, 14)) - 1;
  const item = data_coctail[COCTAIL_ID];
  console.log(COCTAIL_ID);
  return (
    <>
      <div className="container container-recipes">
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/cocktails">
            <IconNapitki className="breadcrumb-icon" />
            Коктейли
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>{item?.name}</Typography>
        </Breadcrumbs>
        <h2>{item.name}</h2>

        <img className="images" src={item.img} alt={item.name} width={250} />
        {item.ingredients && <h3>ИНГРЕДИЕНТЫ</h3>}
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
        {/* <h3>ПОШАГОВЫЙ РЕЦЕПТ ПРИГОТОВЛЕНИЯ</h3>
        <ol>
          {item.steps.map(i => (
            <li className={s.itemStep} key={i.step}>
              {i.img && (
                <img className={s.imageStep} src={i.img} alt="" width={200} />
              )}
              <p className={s.item}>{i.text}</p>
            </li>
          ))}
        </ol> */}
      </div>
    </>
  );
};
