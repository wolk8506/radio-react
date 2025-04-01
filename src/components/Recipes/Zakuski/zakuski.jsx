import { Link, useLocation } from 'react-router-dom';
import { data_zakuski } from '../data/data_zakuski';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import s from '../group.module.css';

export const Zakuski = () => {
  const location = useLocation();
  const ITEM_ID = Number(location.pathname.slice(9)) - 1;
  const item = data_zakuski[ITEM_ID];

  return (
    <>
      <div className="container container-recipes">
        <Link className="link" to="/zakuski">
          <ArrowBackIcon />
        </Link>
        <h2>{item.name}</h2>

        <img src={item.img} alt={item.name} width={412} />
        <h3>ИНГРЕДИЕНТЫ</h3>
        <ul>
          {item.ingredients.map(i => (
            <li key={i.i_name}>
              <p className={s.item}>
                <span className={s.i_name}>{i.i_name}</span>
                <span className={s.bracketLine}></span>
                <span className={s.i_weight}>{i.i_weight}</span>
              </p>
            </li>
          ))}
        </ul>
        <h3>ПОШАГОВЫЙ РЕЦЕПТ ПРИГОТОВЛЕНИЯ</h3>
        <ol>
          {item.steps.map(i => (
            <li className={s.itemStep} key={i.step}>
              {i.img && <img className={s.imageStep} src={i.img} alt="" width={200} />}
              <p className={s.item}>{i.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};
