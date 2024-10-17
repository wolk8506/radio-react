import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCurrencyMonoCurrent_Status, getCurrencyMonoCurrent_Data } from '../../store/selectors';
import { fetchCurrencyMonoCurrent } from '../../store/operation';
import { currencyYesterday } from 'store/actions';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import sprite from '../../images/sprite.svg';
import moment from 'moment';

export const Currency = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrencyMonoCurrent(`https://api.monobank.ua/bank/currency`));
  }, [dispatch]);

  const storeData = useSelector(getCurrencyMonoCurrent_Data);
  const status = useSelector(getCurrencyMonoCurrent_Status);
  const dataCurrency = useSelector(state => state.storeData.currencyYesterday);

  const iconSVG = sprite;
  const [eurTOusaSell, setEurTOusaSell] = useState(0);
  const [eurTOusaBuy, setEurTOusaBuy] = useState(0);
  const [usdTOeurSell, setUsdTOeurSell] = useState(0);
  const [usdTOeurBuy, setUsdTOeurBuy] = useState(0);
  const [USD, setUSD] = useState([]);
  const [EUR, setEUR] = useState([]);
  const [USD_rateBuy, setUSD_rateBuy] = useState(0);
  const [EUR_rateBuy, setEUR_rateBuy] = useState(0);
  const [USD_rateSell, setUSD_rateSell] = useState(0);
  const [EUR_rateSell, setEUR_rateSell] = useState(0);

  useEffect(() => {
    function threeDecimalPlaces(text) {
      const arr = text.split('.');
      let a = arr[0];
      let b;

      if (arr[1] === undefined) b = `0000`;
      else if (arr[1].length === 1) b = `${arr[1]}000`;
      else if (arr[1].length === 2) b = `${arr[1]}00`;
      else if (arr[1].length === 3) b = `${arr[1]}0`;
      else if (arr[1].length === 4) b = `${arr[1]}`;
      let c = `${a}.${b}`;

      return c;
    }
    setUSD_rateBuy(threeDecimalPlaces(String(USD.rateBuy)));
    setEUR_rateBuy(threeDecimalPlaces(String(EUR.rateBuy)));
    setUSD_rateSell(threeDecimalPlaces(String(USD.rateSell)));
    setEUR_rateSell(threeDecimalPlaces(String(EUR.rateSell)));
    setUSD(storeData.find(el => el.currencyCodeA === 840));
    setEUR(storeData.find(el => el.currencyCodeA === 978));
    setEurTOusaSell((EUR.rateSell / USD.rateSell).toFixed(4));
    setEurTOusaBuy((EUR.rateBuy / USD.rateBuy).toFixed(4));
    setUsdTOeurSell((USD.rateSell / EUR.rateSell).toFixed(4));
    setUsdTOeurBuy((USD.rateBuy / EUR.rateBuy).toFixed(4));
  }, [
    EUR.rateBuy,
    EUR.rateSell,
    USD.rateBuy,
    USD.rateSell,
    storeData,
    eurTOusaBuy,
    eurTOusaSell,
    usdTOeurBuy,
    usdTOeurSell,
  ]);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const today = moment().format('DD-MM-YYYY');
  const yesterday = moment().add(-1, 'day').format('DD-MM-YYYY');
  const [arr_today, setArr_today] = useState({
    data: '09-09-2024',
    usd_uah_buy: 40.9,
    usd_eur_buy: '0.9012',
    eur_uah_buy: 45.25,
    eur_usd_buy: '1.1096',
    usd_uah_sell: 41.3206,
    usd_eur_sell: '0.9039',
    eur_uah_sell: 45.8505,
    eur_usd_sell: '1.1064',
  });
  const [arr_yesterday, setArr_yesterday] = useState({
    data: '08-09-2024',
    usd_uah_buy: 40.91,
    usd_eur_buy: '0.9002',
    eur_uah_buy: 45.25,
    eur_usd_buy: '1.1036',
    usd_uah_sell: 41.3206,
    usd_eur_sell: '0.9039',
    eur_uah_sell: 45.8505,
    eur_usd_sell: '1.1054',
  });

  useEffect(() => {
    const arr = {
      data: today,
      // data: '07-09-2024',
      usd_uah_buy: USD.rateBuy,
      usd_eur_buy: usdTOeurSell,
      eur_uah_buy: EUR.rateBuy,
      eur_usd_buy: eurTOusaSell,

      usd_uah_sell: USD.rateSell,
      usd_eur_sell: usdTOeurBuy,
      eur_uah_sell: EUR.rateSell,
      eur_usd_sell: eurTOusaBuy,
    };
    setArr_today(arr);
  }, [
    EUR.rateBuy,
    EUR.rateSell,
    USD.rateBuy,
    USD.rateSell,
    eurTOusaBuy,
    eurTOusaSell,
    today,
    usdTOeurBuy,
    usdTOeurSell,
  ]);

  useEffect(() => {
    if (dataCurrency !== undefined) {
      dataCurrency.map(i => {
        if (i.data === yesterday) {
          setArr_yesterday(i);
        }
        if (i.data === '01-01-2024') {
          setArr_yesterday(arr_today);
        }
        return i;
      });
    }
  }, [arr_today, dataCurrency, yesterday]);

  const [iteration, setIteration] = useState(0);
  const [intervalUpdate, setIntervalUpdate] = useState(400);

  useEffect(() => {
    const interval = setInterval(() => {
      setIteration(iteration + 1);
      if (iteration > 3) setIntervalUpdate(60000);
      dispatch(currencyYesterday([arr_yesterday, arr_today]));
    }, intervalUpdate);
    return () => clearInterval(interval);
  }, [arr_today, arr_yesterday, dispatch, intervalUpdate, iteration]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCurrencyMonoCurrent(`https://api.monobank.ua/bank/currency`));
    }, 900000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const [arr_arrow, setArr_arrow] = useState({
    usd_uah_buy_arrow: '',
    usd_eur_buy_arrow: '',
    eur_uah_buy_arrow: '',
    eur_usd_buy_arrow: '',
    usd_uah_sell_arrow: '',
    usd_eur_sell_arrow: '',
    eur_uah_sell_arrow: '',
    eur_usd_sell_arrow: '',
  });

  const [arr_change, setArr_change] = useState({
    usd_uah_buy_change: 0.01,
    usd_eur_buy_change: -0.01,
    eur_uah_buy_change: 0.01,
    eur_usd_buy_change: 0.01,
    usd_uah_sell_change: 0,
    usd_eur_sell_change: 0.01,
    eur_uah_sell_change: 0,
    eur_usd_sell_change: -0.01,
  });

  useEffect(() => {
    if (dataCurrency !== undefined) {
      let arr_change = {
        usd_uah_buy_change: Number((dataCurrency[1].usd_uah_buy - dataCurrency[0].usd_uah_buy).toFixed(4)),
        usd_eur_buy_change: Number((dataCurrency[1].usd_eur_buy - dataCurrency[0].usd_eur_buy).toFixed(4)),
        eur_uah_buy_change: Number((dataCurrency[1].eur_uah_buy - dataCurrency[0].eur_uah_buy).toFixed(4)),
        eur_usd_buy_change: Number((dataCurrency[1].eur_usd_buy - dataCurrency[0].eur_usd_buy).toFixed(4)),
        usd_uah_sell_change: Number((dataCurrency[1].usd_uah_sell - dataCurrency[0].usd_uah_sell).toFixed(4)),
        usd_eur_sell_change: Number((dataCurrency[1].usd_eur_sell - dataCurrency[0].usd_eur_sell).toFixed(4)),
        eur_uah_sell_change: Number((dataCurrency[1].eur_uah_sell - dataCurrency[0].eur_uah_sell).toFixed(4)),
        eur_usd_sell_change: Number((dataCurrency[1].eur_usd_sell - dataCurrency[0].eur_usd_sell).toFixed(4)),
      };
      const arr_arrow = {
        usd_uah_buy_arrow:
          arr_change.usd_uah_buy_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.usd_uah_buy_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
        usd_eur_buy_arrow:
          arr_change.usd_eur_buy_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.usd_eur_buy_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
        eur_uah_buy_arrow:
          arr_change.eur_uah_buy_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.eur_uah_buy_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
        eur_usd_buy_arrow:
          arr_change.eur_usd_buy_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.eur_usd_buy_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
        usd_uah_sell_arrow:
          arr_change.usd_uah_sell_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.usd_uah_sell_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
        usd_eur_sell_arrow:
          arr_change.usd_eur_sell_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.usd_eur_sell_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
        eur_uah_sell_arrow:
          arr_change.eur_uah_sell_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.eur_uah_sell_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
        eur_usd_sell_arrow:
          arr_change.eur_usd_sell_change > 0 ? (
            <ArrowUpwardIcon />
          ) : arr_change.eur_usd_sell_change === 0 ? (
            ''
          ) : (
            <ArrowDownwardIcon />
          ),
      };
      setArr_change(arr_change);
      setArr_arrow(arr_arrow);
    }
  }, [dataCurrency]);

  return (
    <div className="currency-main">
      <div className="currency-main__title">
        {status ? <CheckCircleOutlineIcon color="success" /> : <WarningAmberIcon color="warning" />}
        <h2>валюта</h2>
        <h2>покупка</h2>
        <h2>продажа</h2>
      </div>
      <div className="currency-main__items">
        <div className="currency-main__item">
          <p className="currency-text name-currency">
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-USD`}></use>
            </svg>
            &emsp;/&emsp;
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-UAH`}></use>
            </svg>
          </p>
          <p className="currency-text">
            <span>{USD_rateBuy}</span>
            <span
              className={arr_change.usd_uah_buy_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.usd_uah_buy_change}
            >
              {arr_arrow.usd_uah_buy_arrow}
            </span>
          </p>
          <p className="currency-text">
            <span>{USD_rateSell}</span>
            <span
              className={arr_change.usd_uah_sell_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.usd_uah_sell_change}
            >
              {arr_arrow.usd_uah_sell_arrow}
            </span>
          </p>
        </div>

        <div className="currency-main__item">
          <p className="currency-text name-currency">
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-EUR`}></use>
            </svg>
            &emsp;/&emsp;
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-UAH`}></use>
            </svg>
          </p>
          <p className="currency-text">
            <span>{EUR_rateBuy}</span>
            <span
              className={arr_change.eur_uah_buy_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.eur_uah_buy_change}
            >
              {arr_arrow.eur_uah_buy_arrow}
            </span>
          </p>
          <p className="currency-text">
            <span>{EUR_rateSell}</span>
            <span
              className={arr_change.eur_uah_sell_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.eur_uah_sell_change}
            >
              {arr_arrow.eur_uah_sell_arrow}
            </span>
          </p>
        </div>
        <div className="currency-main__item">
          <p className="currency-text name-currency">
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-USD`}></use>
            </svg>
            &emsp;/&emsp;
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-EUR`}></use>
            </svg>
          </p>
          <p className="currency-text">
            <span>{usdTOeurSell}</span>
            <span
              className={arr_change.usd_eur_buy_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.usd_eur_buy_change}
            >
              {arr_arrow.usd_eur_buy_arrow}
            </span>
          </p>
          <p className="currency-text">
            <span>{usdTOeurBuy}</span>
            <span
              className={arr_change.usd_eur_sell_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.usd_eur_sell_change}
            >
              {arr_arrow.usd_eur_sell_arrow}
            </span>
          </p>
        </div>
        <div className="currency-main__item">
          <p className="currency-text name-currency">
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-EUR`}></use>
            </svg>
            &emsp;/&emsp;
            <svg className="icon" width="32" height="32">
              <use href={`${iconSVG}#icon-USD`}></use>
            </svg>
          </p>
          <p className="currency-text">
            <span>{eurTOusaSell}</span>
            <span
              className={arr_change.eur_usd_buy_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.eur_usd_buy_change}
            >
              {arr_arrow.eur_usd_buy_arrow}
            </span>
          </p>
          <p className="currency-text">
            <span>{eurTOusaBuy}</span>
            <span
              className={arr_change.eur_usd_sell_change > 0 ? 'arrow--up' : 'arrow--dn'}
              data-tooltip={arr_change.eur_usd_sell_change}
            >
              {arr_arrow.eur_usd_sell_arrow}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
