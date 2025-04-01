import { IconPrrvyeBlyuda } from './icon_1';
import { IconNapitki } from './icon_8';
import { IconVypechka } from './icon_4';
import { IconVtoryeBlyuda } from './icon_3';
import { IconSalaty } from './icon_2';
import { IconZagotovki } from './icon_5';
import { IconSousy } from './icon_9';
import { IconZakuski } from './icon_7';
import { IconDeserty } from './icon_6';
import { Link } from 'react-router-dom';
import s from './Home.module.css';
export const RecipesIndex = () => {
  return (
    <>
      <div
        style={{
          // height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center',
          fontSize: 40,
          textTransform: 'uppercase',
          color: '#ffffff',
        }}
      >
        <ul className={s.menuList}>
          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/soup">
              <IconPrrvyeBlyuda /> Первые блюда
            </Link>
          </li>
          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/meat">
              <IconVtoryeBlyuda /> Вторые блюда
            </Link>
          </li>

          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/salad">
              <IconSalaty /> Салаты
            </Link>
          </li>
          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/zakuski">
              <IconZakuski /> Закуски
            </Link>
          </li>

          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/cakes">
              <IconVypechka /> Выпечка
            </Link>
          </li>

          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/desert">
              <IconDeserty /> Десерты
            </Link>
          </li>

          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/cocktails">
              <IconNapitki /> Коктейли
            </Link>
          </li>
          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/sousy">
              <IconSousy /> Соусы
            </Link>
          </li>
          <li className={s.menuItem}>
            <Link className={s.linckPeople} to="/zagotovki">
              <IconZagotovki /> Заготовки на зиму
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
