import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

const api = axios.create({ baseURL: BASE_URL });

export const CurrencyCrypto = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await api.get('/currency/crypto', { params: { ids: 'bitcoin,ethereum,solana,tether', vs: 'usd,uah' } });
        if (mounted) setData(data?.data?.result);
      } catch {}
      finally { if (mounted) setLoading(false); }
    };
    load();
    const id = setInterval(load, 120000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const coins = [
    { id: 'bitcoin', label: 'Bitcoin', sym: 'BTC', color: '#f59e0b' },
    { id: 'ethereum', label: 'Ethereum', sym: 'ETH', color: '#38bdf8' },
    { id: 'solana', label: 'Solana', sym: 'SOL', color: '#a855f7' },
    { id: 'tether', label: 'Tether', sym: 'USDT', color: '#10b981' },
  ];

  return (
    <section className="secton-nbu">
      <div className="name-section">
        <h2 className="name-section__title">Крипта — CoinGecko</h2>
        <Chip icon={<CurrencyBitcoinIcon />} label="Авто 2 мин" size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', ml: 'auto' }} variant="outlined" />
      </div>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 1.5, p: 2 }}>
        {coins.map(c => {
          const v = data?.[c.id];
          return (
            <Box
              className="block"
              key={c.id}
              sx={{
                background: 'rgba(0,0,0,0.75)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                p: 1.5,
              }}
            >
              <Typography sx={{ color: c.color, fontWeight: 700, fontSize: '0.85rem' }}>
                {c.sym} · {c.label}
              </Typography>
              {loading ? (
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Загрузка…</Typography>
              ) : v ? (
                <>
                  <Typography sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>
                    ${Number(v.usd).toLocaleString('en-US')}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {Number(v.uah).toLocaleString('uk-UA')} ₴
                  </Typography>
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
