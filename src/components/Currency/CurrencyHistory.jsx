import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

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

import { currencyHistoryService } from '../../Pages/Main/currencyHistoryService';
import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

const CURRENCIES = [
  { code: 'USD', label: 'Доллар США', color: '#a855f7' },
  { code: 'EUR', label: 'Евро', color: '#38bdf8' },
  { code: 'PLN', label: 'Злотый', color: '#34d399' },
  { code: 'GBP', label: 'Фунт', color: '#f59e0b' },
  { code: 'CHF', label: 'Франк', color: '#ec4899' },
  { code: 'CAD', label: 'Канадский доллар', color: '#10b981' },
  { code: 'JPY', label: 'Иена', color: '#eab308' },
];

export const CurrencyHistory = () => {
  const [days, setDays] = useState(30);
  const [visible, setVisible] = useState(['USD', 'EUR']);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const codes = CURRENCIES.map(c => c.code);
    currencyHistoryService
      .getHistory(codes, days)
      .then(data => mounted && setHistory(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [days]);

  const chartData = useMemo(() => {
    if (!history) return [];
    const ref = history.USD || history.EUR || Object.values(history)[0] || [];
    const arr = [];
    for (let i = 0; i < ref.length; i++) {
      const row = { date: ref[i].date };
      CURRENCIES.forEach(c => {
        const series = history[c.code];
        row[c.code] = series && series[i] ? series[i].rate : undefined;
      });
      arr.push(row);
    }
    return arr;
  }, [history]);

  const handleDays = (e, val) => {
    if (val) setDays(val);
  };

  const handleToggle = code => {
    setVisible(prev => (prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]));
  };

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
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
          {moment(label, 'DD.MM.YYYY').format('D MMMM YYYY')}
        </Typography>
        {payload.map(p => (
          <Typography key={p.dataKey} sx={{ color: p.color, fontSize: '0.75rem' }}>
            {CURRENCIES.find(c => c.code === p.dataKey)?.label}: {p.value?.toFixed(4)}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <section className="secton-nbu currency-history">
      <div className="name-section">
        <h2 className="name-section__title">График курса НБУ.</h2>
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
      <Box className="conteiner" p={2} ><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1, px: 2 }}>
        {CURRENCIES.map(c => {
          const on = visible.includes(c.code);
          return (
            <Chip
              key={c.code}
              label={c.label}
              clickable
              onClick={() => handleToggle(c.code)}
              sx={{
                borderColor: c.color,
                color: on ? '#fff' : 'rgba(255,255,255,0.4)',
                borderStyle: 'solid',
                borderWidth: 1,
                backgroundColor: on ? `${c.color}33` : 'transparent',
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
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                {CURRENCIES.map(c => (
                  <linearGradient key={c.code} id={`hist-${c.code}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c.color} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={c.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }}
                tickFormatter={d => moment(d, 'DD.MM.YYYY').format('D.MM')}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} width={48} domain={['auto', 'auto']} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
              {CURRENCIES.map(c =>
                visible.includes(c.code) ? (
                  <Area
                    key={c.code}
                    type="monotone"
                    dataKey={c.code}
                    stroke={c.color}
                    strokeWidth={2}
                    fill={`url(#hist-${c.code})`}
                    dot={false}
                    connectNulls
                  />
                ) : null
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box></Box>

      
    </section>
  );
};
