import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, MenuItem, IconButton } from '@mui/material';

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EuroIcon from '@mui/icons-material/Euro';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import axios from 'axios';
import { BASE_URL } from '../../config';
import { currencySelectors, currencyOperations } from 'store';
import moment from 'moment';

const api = axios.create({ baseURL: BASE_URL });

const CONVERT_CURRENCIES = ['UAH', 'USD', 'EUR', 'BTC'];

export const CurrencyCard = () => {
  const dispatch = useDispatch();

  const storeData = useSelector(currencySelectors.getCurrencyMonoCurrent_Data);
  const dataCurrency = useSelector(currencySelectors.getCurrencyYesterday);

  const [mode, setMode] = useState('rates'); // 'rates' | 'convert'
  const [usd, setUsd] = useState({ rateBuy: 0, rateSell: 0 });
  const [eur, setEur] = useState({ rateBuy: 0, rateSell: 0 });
  const [eurUsd, setEurUsd] = useState({ buy: 0, sell: 0 });
  const [btc, setBtc] = useState({ usd: 0, uah: 0 });
  const [btcTrend, setBtcTrend] = useState('neutral');
  const prevBtc = useRef(0);
  const [trends, setTrends] = useState({});
  const [updatedAt, setUpdatedAt] = useState('');

  // converter state
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('UAH');

  useEffect(() => {
    dispatch(currencyOperations.fetchCurrencyMonoCurrent('https://api.monobank.ua/bank/currency'));
  }, [dispatch]);

  // BTC via backend (CoinGecko, кеш 2 мин)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await api.get('/currency/crypto', { params: { ids: 'bitcoin', vs: 'usd,uah' } });
        const v = data?.data?.result?.bitcoin;
        if (!mounted || !v) return;
        setBtc({ usd: Number(v.usd) || 0, uah: Number(v.uah) || 0 });
        if (prevBtc.current && v.usd) {
          setBtcTrend(v.usd > prevBtc.current ? 'up' : v.usd < prevBtc.current ? 'down' : 'neutral');
        }
        if (v.usd) prevBtc.current = Number(v.usd);
      } catch {}
    };
    load();
    const id = setInterval(load, 120000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    if (!storeData) return;

    const USD = storeData.find(el => el.currencyCodeA === 840);
    const EUR = storeData.find(el => el.currencyCodeA === 978);

    if (USD && EUR) {
      setUsd({ rateBuy: USD.rateBuy, rateSell: USD.rateSell });
      setEur({ rateBuy: EUR.rateBuy, rateSell: EUR.rateSell });
      setEurUsd({
        buy: USD.rateBuy && EUR.rateBuy ? (EUR.rateBuy / USD.rateBuy).toFixed(4) : 0,
        sell: USD.rateSell && EUR.rateSell ? (EUR.rateSell / USD.rateSell).toFixed(4) : 0,
      });
      if (USD.date) setUpdatedAt(moment.unix(USD.date).format('HH:mm'));
    } else if (USD) {
      setUsd({ rateBuy: USD.rateBuy, rateSell: USD.rateSell });
      if (USD.date) setUpdatedAt(moment.unix(USD.date).format('HH:mm'));
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
        if (todayVal == null || yesterdayVal == null) return 'neutral';
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

  const formatMoney = (v, digits = 0) => {
    if (!v) return '—';
    return Number(v).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
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

  // rates to UAH for converter (buy)
  const rateToUah = (code) => {
    if (code === 'UAH') return 1;
    if (code === 'USD') return usd.rateBuy || usd.rateSell || 0;
    if (code === 'EUR') return eur.rateBuy || eur.rateSell || 0;
    if (code === 'BTC') return btc.uah || 0;
    return 0;
  };

  const amountNum = parseFloat(amount) || 0;
  const fromRate = rateToUah(from);
  const toRate = rateToUah(to);
  const converted = fromRate && toRate ? (amountNum * fromRate) / toRate : 0;
  const formatConverted = (v, code) => {
    if (!v) return '0';
    if (code === 'BTC') return Number(v).toFixed(6);
    if (code === 'UAH' && v >= 1000) return formatMoney(v, 2);
    return Number(v).toFixed(2);
  };
  const crossRate = fromRate && toRate ? fromRate / toRate : 0;

  const swapConvert = () => {
    setFrom(to);
    setTo(from);
  };

  const pairs = [
    {
      label: 'USD / UAH',
      buyLabel: 'Покупка',
      sellLabel: 'Продажа',
      buy: formatRate(usd.rateBuy),
      sell: formatRate(usd.rateSell),
      trendBuy: trends.usdUahBuy,
      trendSell: trends.usdUahSell,
      icon: <AttachMoneyIcon sx={{ fontSize: '1rem', color: '#a855f7' }} />,
    },
    {
      label: 'EUR / UAH',
      buyLabel: 'Покупка',
      sellLabel: 'Продажа',
      buy: formatRate(eur.rateBuy),
      sell: formatRate(eur.rateSell),
      trendBuy: trends.eurUahBuy,
      trendSell: trends.eurUahSell,
      icon: <EuroIcon sx={{ fontSize: '1rem', color: '#a855f7' }} />,
    },
    {
      label: 'EUR / USD',
      buyLabel: 'Покупка',
      sellLabel: 'Продажа',
      buy: formatRate(eurUsd.buy),
      sell: formatRate(eurUsd.sell),
      trendBuy: trends.eurUsdBuy,
      trendSell: trends.eurUsdSell,
      icon: <SwapHorizIcon sx={{ fontSize: '1rem', color: '#a855f7' }} />,
    },
    {
      label: 'BTC / USD',
      buyLabel: 'USD',
      sellLabel: 'UAH',
      buy: btc.usd ? `$${formatMoney(btc.usd)}` : '—',
      sell: btc.uah ? `₴${formatMoney(btc.uah)}` : '—',
      trendBuy: btcTrend,
      trendSell: btcTrend,
      icon: <CurrencyBitcoinIcon sx={{ fontSize: '1rem', color: '#f59e0b' }} />,
    },
  ];

  const segBtn = active => ({
    fontSize: '0.62rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    border: 'none',
    borderRadius: '8px',
    padding: '3px 9px',
    cursor: 'pointer',
    background: active ? 'rgba(168,85,247,0.25)' : 'transparent',
    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
  });

  return (
    <Box
      className="col-6 row-span-5 card-main-page"
      sx={{ height: '236px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Шапка карточки + переключатель */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', flexShrink: 0 }}>
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
          {mode === 'rates' ? 'Курсы валют' : 'Конвертер'}
        </Typography>
        {mode === 'rates' && updatedAt && (
          <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
            {updatedAt}
          </Typography>
        )}
        <Box sx={{ ml: 'auto', display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '2px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button style={segBtn(mode === 'rates')} onClick={() => setMode('rates')}>Курсы</button>
          <button style={segBtn(mode === 'convert')} onClick={() => setMode('convert')}>Конвертер</button>
        </Box>
      </Box>

      {mode === 'rates' ? (
        /* Список валютных пар — 4 строки в 236px */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', my: 'auto', width: '100%' }}>
          {pairs.map((pair, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '5px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Название валюты */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', width: '102px', flexShrink: 0 }}>
                {pair.icon}
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff' }}>{pair.label}</Typography>
              </Box>

              {/* Колонки */}
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '64px' }}>
                  <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', lineHeight: 1.2 }}>
                    {pair.buyLabel}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace', lineHeight: 1.3 }}>
                      {pair.buy}
                    </Typography>
                    {renderTrendIcon(pair.trendBuy)}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '64px' }}>
                  <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', lineHeight: 1.2 }}>
                    {pair.sellLabel}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace', lineHeight: 1.3 }}>
                      {pair.sell}
                    </Typography>
                    {renderTrendIcon(pair.trendSell)}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        /* Компактный конвертер */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', my: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <TextField
              label="Сумма"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiInputBase-root': { color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                '& label': { color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' },
              }}
            />
            <IconButton
              onClick={swapConvert}
              size="small"
              sx={{ color: '#a855f7', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.25)', width: 36, height: 36, flexShrink: 0 }}
            >
              <SwapHorizIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: '8px' }}>
            <TextField
              select
              label="Из"
              value={from}
              onChange={e => setFrom(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiInputBase-root': { color: '#fff', fontSize: '0.85rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                '& label': { color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' },
              }}
            >
              {CONVERT_CURRENCIES.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="В"
              value={to}
              onChange={e => setTo(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiInputBase-root': { color: '#fff', fontSize: '0.85rem', background: 'rgba(0,0,0,0.25)', borderRadius: '12px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                '& label': { color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' },
              }}
            >
              {CONVERT_CURRENCIES.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box
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
            <Box>
              <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                {amount || 0} {from} =
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace', lineHeight: 1.2 }}>
                {formatConverted(converted, to)} {to}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', textAlign: 'right' }}>
              1 {from} = {crossRate ? (to === 'BTC' ? crossRate.toFixed(6) : crossRate.toFixed(4)) : '—'} {to}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
