import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';

const api = axios.create({ baseURL: BASE_URL });

export const CurrencyOil = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await api.get('/currency/oil');
        if (mounted) setData(data?.data?.result);
      } catch {}
      finally { if (mounted) setLoading(false); }
    };
    load();
    const id = setInterval(load, 120000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const oils = [
    { id: 'brent', label: 'Brent', sym: 'BRN', color: '#fbbf24' },
    { id: 'wti', label: 'WTI', sym: 'CL', color: '#60a5fa' },
  ];

  const renderChange = change => {
    if (change == null) return null;
    const up = change >= 0;
    return (
      <Typography sx={{ color: up ? '#10b981' : '#ef4444', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700 }}>
        {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </Typography>
    );
  };

  return (
    <section className="secton-nbu">
      <div className="name-section">
        <h2 className="name-section__title">Нефть — Stooq</h2>
        <Chip icon={<OilBarrelIcon />} label="Авто 2 мин" size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', ml: 'auto' }} variant="outlined" />
      </div>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 1.5, p: 2 }}>
        {oils.map(o => {
          const v = data?.[o.id];
          return (
            <Box
              className="block"
              key={o.id}
              sx={{
                background: 'rgba(0,0,0,0.75)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                p: 1.5,
              }}
            >
              <Typography sx={{ color: o.color, fontWeight: 700, fontSize: '0.85rem' }}>
                {o.sym} · {o.label}
              </Typography>
              {loading ? (
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Загрузка…</Typography>
              ) : v ? (
                <>
                  <Typography sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>
                    ${Number(v.price).toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {renderChange(v.change)}
                    {v.date && (
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
                        {v.date}
                      </Typography>
                    )}
                  </Box>
                </>
              ) : (
                <Typography sx={{ color: '#ef4444', fontSize: '0.75rem' }}>—</Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </section>
  );
};
