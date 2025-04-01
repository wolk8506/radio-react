import { Link, useLocation } from 'react-router-dom';
import { data_meat } from '../data/data_meat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Meat = () => {
  const location = useLocation();
  const ITEM_ID = Number(location.pathname.slice(6)) - 1;
  //   console.log(CAKE_ID);
  const item = data_meat[ITEM_ID];

  return (
    <>
      <div className="container container-recipes">
        <Link className="link" to="/meat">
          <ArrowBackIcon />
        </Link>
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
