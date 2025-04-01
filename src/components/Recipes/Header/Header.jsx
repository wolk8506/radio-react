import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './Header.module.css';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import { IconPrrvyeBlyuda } from 'img/icon_1';
import { IconNapitki } from 'img/icon_8';
import { IconVypechka } from 'img/icon_4';
import { IconVtoryeBlyuda } from 'img/icon_3';
import { IconSalaty } from 'img/icon_2';
import { IconZagotovki } from 'img/icon_5';
import { IconSousy } from 'img/icon_9';
import { IconZakuski } from 'img/icon_7';
import { IconDeserty } from 'img/icon_6';
import imgMenu from '../../img/imgMenu.png';

export const Header = () => {
  const [activMenu, setActivMenu] = useState(true);

  const handleActivMenu = () => {
    setActivMenu(!activMenu);
  };
  return (
    <>
      <div className={s.header}>
        <div className={s.navigation}>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={handleActivMenu}
          >
            {activMenu ? <DensityMediumIcon /> : <CloseIcon />}
          </IconButton>
        </div>
        <div className={activMenu ? s.menu : s.activMenu}>
          <img className={s.imgMenu} src={imgMenu} alt="" width={200} />
          <ul className={s.menuList}>
            <li className={s.menuItem}>
              <Link className={s.linckPeople} to="/" onClick={handleActivMenu}>
                Home
              </Link>
            </li>
            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/soup"
                onClick={handleActivMenu}
              >
                <IconPrrvyeBlyuda /> Первые блюда
              </Link>
            </li>
            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/meat"
                onClick={handleActivMenu}
              >
                <IconVtoryeBlyuda /> Вторые блюда
              </Link>
            </li>

            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/salad"
                onClick={handleActivMenu}
              >
                <IconSalaty /> Салаты
              </Link>
            </li>
            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/zakuski"
                onClick={handleActivMenu}
              >
                <IconZakuski /> Закуски
              </Link>
            </li>

            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/cakes"
                onClick={handleActivMenu}
              >
                <IconVypechka /> Выпечка
              </Link>
            </li>

            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/desert"
                onClick={handleActivMenu}
              >
                <IconDeserty /> Десерты
              </Link>
            </li>

            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/cocktails"
                onClick={handleActivMenu}
              >
                <IconNapitki /> Коктейли
              </Link>
            </li>
            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/sousy"
                onClick={handleActivMenu}
              >
                <IconSousy /> Соусы
              </Link>
            </li>
            <li className={s.menuItem}>
              <Link
                className={s.linckPeople}
                to="/zagotovki"
                onClick={handleActivMenu}
              >
                <IconZagotovki /> Заготовки на зиму
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
