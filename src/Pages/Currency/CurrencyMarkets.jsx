import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

const api = axios.create({ baseURL: BASE_URL });

const SYMBOLS = [
  { id: 'bitcoin', kind: 'crypto', label: 'Bitcoin', color: '#f59e0b' },
  { id: 'ethereum', kind: 'crypto', label: 'Ethereum', color: '#38bdf8' },
  { id: 'brent', kind: 'oil', label: 'Brent', color: '#fbbf24' },
  { id: 'wti', kind: 'oil', label: 'WTI', color: '#60a5fa' },
];

export const CurrencyMarkets = () => {
  const [symbol, setSymbol] = useState('bitcoin');
  const [days, setDays] = useState(30);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const active = SYMBOLS.find(s => s.id === symbol) || SYMBOLS[0];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const url = active.kind === 'crypto' ? '/currency/crypto-history' : '/currency/oil-history';
    const params =
      active.kind === 'crypto'
        ? { coin: active.id, vs: 'usd', days }
        : { symbol: active.id, days };
    api
      .get(url, { params })
      .then(({ data }) => mounted && setHistory(data?.data?.result || []))
      .catch(() => mounted && setHistory([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [symbol, days, active.kind, active.id]);

  const chartData = useMemo(() => history, [history]);

  const handleDays = (e, val) => {
    if (val) setDays(val);
  };

  const ChartTooltip = ({ active: tActive, payload, label }) => {
    if (!tActive || !payload || !payload.length) return null;
    return (
      <Box
        sx={{
          background: 'rgba(20,24,32,0.95)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 1,
          p: 1,
        }}
      >
        <Typography sx={{ color: '#fff', fontSize: '0.75rem', mb: 0.5 }}>
          {moment(label, 'YYYY-MM-DD').format('D MMMM YYYY')}
        </Typography>
        {payload.map(p => (
          <Typography key={p.dataKey} sx={{ color: active.color, fontSize: '0.75rem', fontFamily: 'monospace' }}>
            {active.label}: ${Number(p.value).toLocaleString('en-US')}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <section className="secton-nbu currency-history">
      <div className="name-section">
        <h2 className="name-section__title">График рынка — BTC/ETH/нефть, $.</h2>
        <ToggleButtonGroup size="small" exclusive value={days} onChange={handleDays} sx={{ ml: 'auto', height: 32 }}>
          <ToggleButton value={7} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            7 дн
          </ToggleButton>
          <ToggleButton value={30} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            30 дн
          </ToggleButton>
          <ToggleButton value={90} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            90 дн
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <Box className="conteiner" p={2}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1, px: 2, alignItems: 'center' }}>
          <ShowChartIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }} />
          {SYMBOLS.map(s => {
            const on = s.id === symbol;
            return (
              <Chip
                key={s.id}
                label={s.label}
                clickable
                onClick={() => setSymbol(s.id)}
                sx={{
                  borderColor: s.color,
                  color: on ? '#fff' : 'rgba(255,255,255,0.4)',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  backgroundColor: on ? `${s.color}33` : 'transparent',
                  '& .MuiChip-label': { fontWeight: 600 },
                }}
              />
            );
          })}
        </Box>

        <Box sx={{ width: '100%', height: 320, px: 1, pb: 1 }}>
          {loading && !chartData.length ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Загрузка графика…
            </Box>
          ) : !chartData.length ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Нет данных
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="market-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={active.color} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={active.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
                  tickFormatter={d => moment(d, 'YYYY-MM-DD').format('D.MM')}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
                  width={64}
                  domain={['auto', 'auto']}
                  tickFormatter={v => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={active.color}
                  strokeWidth={2}
                  fill="url(#market-area)"
                  dot={false}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </section>
  );
};
