import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EuroIcon from '@mui/icons-material/Euro';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { currencySelectors, currencyOperations } from 'store';
import moment from 'moment';

export const CurrencyCard = () => {
  const dispatch = useDispatch();

  const storeData = useSelector(currencySelectors.getCurrencyMonoCurrent_Data);
  const dataCurrency = useSelector(currencySelectors.getCurrencyYesterday);

  const [usd, setUsd] = useState({ rateBuy: 0, rateSell: 0 });
  const [eur, setEur] = useState({ rateBuy: 0, rateSell: 0 });
  const [eurUsd, setEurUsd] = useState({ buy: 0, sell: 0 });
  const [trends, setTrends] = useState({});

  useEffect(() => {
    dispatch(currencyOperations.fetchCurrencyMonoCurrent('https://api.monobank.ua/bank/currency'));
  }, [dispatch]);

  useEffect(() => {
    if (!storeData) return;

    const USD = storeData.find(el => el.currencyCodeA === 840);
    const EUR = storeData.find(el => el.currencyCodeA === 978);

    if (USD && EUR) {
      setUsd({ rateBuy: USD.rateBuy, rateSell: USD.rateSell });
      setEur({ rateBuy: EUR.rateBuy, rateSell: EUR.rateSell });
      setEurUsd({
        buy: (EUR.rateBuy / USD.rateBuy).toFixed(4),
        sell: (EUR.rateSell / USD.rateSell).toFixed(4),
      });
    }
  }, [storeData]);

  useEffect(() => {
    if (!dataCurrency) return;

    const today = moment().format('DD-MM-YYYY');
    const yesterday = moment().add(-1, 'day').format('DD-MM-YYYY');

    const todayData = dataCurrency.find(d => d.data === today);
    const yesterdayData = dataCurrency.find(d => d.data === yesterday);

    if (todayData && yesterdayData) {
      const calcTrend = (todayVal, yesterdayVal) => {
        const diff = Number((todayVal - yesterdayVal).toFixed(4));
        return diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
      };

      setTrends({
        usdUahBuy: calcTrend(todayData.usd_uah_buy, yesterdayData.usd_uah_buy),
        usdUahSell: calcTrend(todayData.usd_uah_sell, yesterdayData.usd_uah_sell),
        eurUahBuy: calcTrend(todayData.eur_uah_buy, yesterdayData.eur_uah_buy),
        eurUahSell: calcTrend(todayData.eur_uah_sell, yesterdayData.eur_uah_sell),
        eurUsdBuy: calcTrend(todayData.eur_usd_buy, yesterdayData.eur_usd_buy),
        eurUsdSell: calcTrend(todayData.eur_usd_sell, yesterdayData.eur_usd_sell),
      });
    }
  }, [dataCurrency]);

  const formatRate = rate => {
    if (!rate) return '—';
    const str = String(rate);
    const parts = str.split('.');
    const intPart = parts[0];
    const decPart = (parts[1] || '').padEnd(4, '0').slice(0, 4);
    return `${intPart}.${decPart}`;
  };

  const renderTrendIcon = trend => {
    if (trend === 'up') {
      return <ArrowUpwardIcon sx={{ fontSize: '0.8rem', color: '#10b981' }} />;
    }
    if (trend === 'down') {
      return <ArrowDownwardIcon sx={{ fontSize: '0.8rem', color: '#ef4444' }} />;
    }
    return null;
  };

  const pairs = [
    {
      label: 'USD / UAH',
      buy: formatRate(usd.rateBuy),
      sell: formatRate(usd.rateSell),
      trendBuy: trends.usdUahBuy,
      trendSell: trends.usdUahSell,
      icon: <AttachMoneyIcon sx={{ fontSize: '1rem', color: '#a855f7' }} />,
    },
    {
      label: 'EUR / UAH',
      buy: formatRate(eur.rateBuy),
      sell: formatRate(eur.rateSell),
      trendBuy: trends.eurUahBuy,
      trendSell: trends.eurUahSell,
      icon: <EuroIcon sx={{ fontSize: '1rem', color: '#a855f7' }} />,
    },
    {
      label: 'EUR / USD',
      buy: formatRate(eurUsd.buy),
      sell: formatRate(eurUsd.sell),
      trendBuy: trends.eurUsdBuy,
      trendSell: trends.eurUsdSell,
      icon: <SwapHorizIcon sx={{ fontSize: '1rem', color: '#a855f7' }} />,
    },
  ];

  return (
    <Box
      className="col-6 row-span-5 card-main-page"
      sx={{
        // width: '100%',
        height: '236px',
        // borderRadius: '22px',
        // padding: '18px 20px',
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'space-between',
        // boxSizing: 'border-box',
        // position: 'relative',
        // background: 'rgba(30, 35, 45, 0.45)',
        // backdropFilter: 'blur(40px) saturate(210%)',
        // WebkitBackdropFilter: 'blur(40px) saturate(210%)',
        // border: '1px solid rgba(255, 255, 255, 0.18)',
        // boxShadow:
        //   '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
      }}
    >
      {/* Шапка карточки */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <CurrencyExchangeIcon sx={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)' }} />
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(255, 255, 255, 0.65)',
          }}
        >
          Курсы валют
        </Typography>
      </Box>

      {/* Список валютных пар */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', my: 'auto', width: '100%' }}>
        {pairs.map((pair, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '8px 14px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Название валюты */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', width: '110px' }}>
              {pair.icon}
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{pair.label}</Typography>
            </Box>

            {/* Колонки Покупка / Продажа */}
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* Покупка */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '70px' }}>
                <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                  Покупка
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                    {pair.buy}
                  </Typography>
                  {renderTrendIcon(pair.trendBuy)}
                </Box>
              </Box>

              {/* Продажа */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '70px' }}>
                <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase' }}>
                  Продажа
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                    {pair.sell}
                  </Typography>
                  {renderTrendIcon(pair.trendSell)}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
