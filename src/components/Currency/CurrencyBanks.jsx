import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';

const api = axios.create({ baseURL: BASE_URL });

export const CurrencyBanks = () => {
  const [banks, setBanks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await api.get('/currency/banks');
        if (mounted) setBanks(data?.data?.result);
      } catch {}
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const getPrivat = (ccy) => {
    if (!banks?.privat) return null;
    return banks.privat.find(p => p.ccy === ccy);
  };
  const getMono = (codeA) => {
    if (!banks?.mono) return null;
    return banks.mono.find(m => m.currencyCodeA === codeA);
  };

  const rows = [
    { code: 'USD', ccy: 'USD', codeA: 840, label: 'Доллар', nbu: banks?.nbu?.USD },
    { code: 'EUR', ccy: 'EUR', codeA: 978, label: 'Евро', nbu: banks?.nbu?.EUR },
    { code: 'PLN', ccy: 'PLN', codeA: 985, label: 'Злотый', nbu: banks?.nbu?.PLN },
    // { code: 'GBP', ccy: 'GBP', codeA: 826, label: 'Фунт', nbu: banks?.nbu?.GBP },
    // { code: 'CHF', ccy: 'CHF', codeA: 756, label: 'Франк', nbu: banks?.nbu?.CHF },
    // { code: 'JPY', ccy: 'JPY', codeA: 392, label: 'Иена', nbu: banks?.nbu?.JPY },
  ];

  const bestBuy = (arr) => Math.max(...arr.filter(v=> v>0));
  const bestSell = (arr) => Math.min(...arr.filter(v=> v>0));

  return (
    <section className="secton-nbu">
      <div className="name-section">
        <h2 className="name-section__title">Сравнение банков — Privat + Mono + NBU (бесплатно)</h2>
        <Typography sx={{ ml: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Зелёный — лучший buy/sell, спред = sell-buy</Typography>
      </div>
      <TableContainer component={Paper} sx={{ background: '#121214', border: '1px solid #1f1f22', borderRadius: '14px', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#1e1e1e' }}>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Валюта</TableCell>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }} align="right">NBU</TableCell>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }} align="right">Privat buy</TableCell>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }} align="right">Privat sell</TableCell>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }} align="right">Mono buy</TableCell>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }} align="right">Mono sell</TableCell>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }} align="right">Спред Privat</TableCell>
              <TableCell sx={{ color: '#c2a85a', borderBottom: '1px solid #2a2a2e', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }} align="right">Спред Mono</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} sx={{ color: 'rgba(255,255,255,0.5)', background: '#121214' }}>Загрузка…</TableCell></TableRow>
            ) : rows.map(r => {
              const p = getPrivat(r.ccy);
              const m = getMono(r.codeA);
              const pBuy = p ? parseFloat(p.buy) : 0;
              const pSell = p ? parseFloat(p.sale) : 0;
              const mBuy = m ? m.rateBuy : 0;
              const mSell = m ? m.rateSell : 0;
              const buys = [pBuy, mBuy].filter(Boolean);
              const sells = [pSell, mSell].filter(Boolean);
              const bBuy = bestBuy(buys);
              const bSell = bestSell(sells);
              const spread = (vBuy, vSell) => vBuy && vSell ? (vSell - vBuy).toFixed(4) : '—';
              return (
                <TableRow key={r.code} sx={{ background: r.code === 'USD' ? '#121214' : r.code === 'EUR' ? '#161618' : '#121214', '& td': { borderBottom: '1px solid #232326' } }}>
                  <TableCell sx={{ color: '#e8dcc3', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{r.label} {r.code}</TableCell>
                  <TableCell align="right" sx={{ color: '#e8dcc3', fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{r.nbu ? Number(r.nbu).toFixed(4) : '—'}</TableCell>
                  <TableCell align="right" sx={{ color: pBuy===bBuy && pBuy? '#10b981' : '#e8dcc3', fontWeight: pBuy===bBuy?700:400, fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{pBuy? pBuy.toFixed(4):'—'}</TableCell>
                  <TableCell align="right" sx={{ color: pSell===bSell && pSell? '#10b981' : '#e8dcc3', fontWeight: pSell===bSell?700:400, fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{pSell? pSell.toFixed(4):'—'}</TableCell>
                  <TableCell align="right" sx={{ color: mBuy===bBuy && mBuy? '#10b981' : '#e8dcc3', fontWeight: mBuy===bBuy?700:400, fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{mBuy? mBuy.toFixed(4):'—'}</TableCell>
                  <TableCell align="right" sx={{ color: mSell===bSell && mSell? '#10b981' : '#e8dcc3', fontWeight: mSell===bSell?700:400, fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{mSell? mSell.toFixed(4):'—'}</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(232,220,195,0.6)', fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{spread(pBuy,pSell)}</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(232,220,195,0.6)', fontFamily: 'monospace', borderBottom: '1px solid #232326' }}>{spread(mBuy,mSell)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {banks?.meta?.monoStale && (
        <Typography sx={{ color: '#f59e0b', fontSize: '0.7rem', px: 1, mt: 0.5 }}>
          Mono лимит 60 сек (429) — показываем кеш, обновится автоматически.
        </Typography>
      )}
      <Box sx={{ p: 1, color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>APIs: api.privatbank.ua + api.monobank.ua + bank.gov.ua (все без ключа). Кеш Privat 5м, Mono 90с, NBU 6ч.</Box>
    </section>
  );
};
