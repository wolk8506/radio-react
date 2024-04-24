import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import s from './Currency.module.css';
import sprite from '../../images/sprite.svg';

export const Currency = () => {
  const dataMono = useSelector(state => state.storeCurrencyMonoToday);

  const iconSVG = sprite;
  const [eurTOusaSell, setEurTOusaSell] = useState('-,----');
  const [eurTOusaBuy, setEurTOusaBuy] = useState('-,----');
  const [usdTOeurSell, setUsdTOeurSell] = useState('-,----');
  const [usdTOeurBuy, setUsdTOeurBuy] = useState('-,----');
  const [USD, setUSD] = useState([]);
  const [EUR, setEUR] = useState([]);

  useEffect(() => {
    if (dataMono.length !== 0) {
      setUSD(dataMono.find(el => el.currencyCodeA === 840));
      setEUR(dataMono.find(el => el.currencyCodeA === 978));
      setEurTOusaSell((EUR.rateSell / USD.rateSell).toFixed(4));
      setEurTOusaBuy((EUR.rateBuy / USD.rateBuy).toFixed(4));
      setUsdTOeurSell((USD.rateSell / EUR.rateSell).toFixed(4));
      setUsdTOeurBuy((USD.rateBuy / EUR.rateBuy).toFixed(4));
    }
  }, [
    EUR.rateBuy,
    EUR.rateSell,
    USD.rateBuy,
    USD.rateSell,
    dataMono,
    eurTOusaBuy,
    eurTOusaSell,
    usdTOeurBuy,
    usdTOeurSell,
  ]);

  return (
    <>
      <div className={s.header}>
        <div className={s.currency}>
          <svg className={s.icon} width="96" height="72">
            <use href={`${iconSVG}#icon-USD`}></use>
          </svg>
          <div>
            <p className={s.currencyUsd}>
              1 &#36; покупка: $ {USD.rateBuy}₴ | продажа: ${USD.rateSell} ₴
            </p>
            <p className={s.currencyUsd}>
              1 &#36; покупка: {usdTOeurSell} &#8364; | продажа: $ {usdTOeurBuy}
              &#8364;
            </p>
          </div>
        </div>

        <div className={s.currency}>
          <svg className={s.icon} width="96" height="72">
            <use href={`${iconSVG}#icon-EUR`}></use>
          </svg>
          <div>
            <p className={s.currencyEur}>
              1 &#8364; покупка: ${EUR.rateBuy} ₴ | продажа: ${EUR.rateSell} ₴
            </p>
            <p className={s.currencyEur}>
              1 &#8364; покупка: ${eurTOusaSell} &#36; | продажа: ${eurTOusaBuy}
              &#36;
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
