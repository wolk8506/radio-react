import { IconPrrvyeBlyuda } from './img/icon_1';
import { IconNapitki } from './img/icon_8';
import { IconVypechka } from './img/icon_4';
import { IconVtoryeBlyuda } from './img/icon_3';
import { IconSalaty } from './img/icon_2';
import { IconZagotovki } from './img/icon_5';
import { IconSousy } from './img/icon_9';
import { IconZakuski } from './img/icon_7';
import { IconDeserty } from './img/icon_6';
import { Link } from 'react-router-dom';
// import s from './Home.module.css';
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
        <ul className="menuList">
          <li className="menuItem">
            <Link className="linckPeople" to="/soup">
              <IconPrrvyeBlyuda /> Первые блюда
            </Link>
          </li>
          <li className="menuItem">
            <Link className="linckPeople" to="/meat">
              <IconVtoryeBlyuda /> Вторые блюда
            </Link>
          </li>

          <li className="menuItem">
            <Link className="linckPeople" to="/salad">
              <IconSalaty /> Салаты
            </Link>
          </li>
          <li className="menuItem">
            <Link className="linckPeople" to="/zakuski">
              <IconZakuski /> Закуски
            </Link>
          </li>

          <li className="menuItem">
            <Link className="linckPeople" to="/cakes">
              <IconVypechka /> Выпечка
            </Link>
          </li>

          <li className="menuItem">
            <Link className="linckPeople" to="/desert">
              <IconDeserty /> Десерты
            </Link>
          </li>

          <li className="menuItem">
            <Link className="linckPeople" to="/cocktails">
              <IconNapitki /> Коктейли
            </Link>
          </li>
          <li className="menuItem">
            <Link className="linckPeople" to="/sousy">
              <IconSousy /> Соусы
            </Link>
          </li>
          <li className="menuItem">
            <Link className="linckPeople" to="/zagotovki">
              <IconZagotovki /> Заготовки на зиму
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
