import * as React from 'react';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import axios from 'axios';
import { BASE_URL } from '../../config';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Typography from '@mui/material/Typography';

const api = axios.create({ baseURL: BASE_URL });
const POPULAR = ['UAH','USD','EUR','PLN','GBP','CHF','CAD','JPY','TRY','CNY','SEK','NOK','DKK','CZK','HUF','ILS','AUD'];

const currencySign = {
  UAH: '₴ ', USD: '$ ', EUR: '€ ', PLN: 'Zł ', GBP: '£ ', CHF: 'Fr ', CAD: 'C$ ', JPY: '¥ ', TRY: '₺ ', CNY: '¥ ', SEK: 'kr ', NOK: 'kr ', DKK: 'kr ', CZK: 'Kč ', HUF: 'Ft ', ILS: '₪ ', AUD: 'A$ ',
};

export const CurrencyConverterEnhanced = () => {
  const [valueSelect1, setValueSelect1] = useState('USD');
  const [valueSelect2, setValueSelect2] = useState('UAH');
  const [valueText1, setValueText1] = useState('100');
  const [valueText2, setValueText2] = useState('0');
  const [textField_On_1, setTextField_On_1] = useState(true);
  const [textField_On_2, setTextField_On_2] = useState(false);
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState(POPULAR);
  const [d1, setD1] = useState(POPULAR.slice(1));
  const [d2, setD2] = useState(POPULAR.filter(c=> c!=='USD').slice(0,5));

  // fetch rates for base
  useEffect(() => {
    let mounted = true;
    const fetchRates = async () => {
      try {
        const { data } = await api.get('/currency/rates', { params: { base: valueSelect1 } });
        const r = data?.data?.result?.rates;
        if (!mounted || !r) return;
        setRates(r);
        const keys = Object.keys(r);
        const merged = Array.from(new Set([...POPULAR, ...keys])).sort();
        setCurrencies(merged);
      } catch {}
    };
    fetchRates();
    return () => { mounted = false; };
  }, [valueSelect1]);

  // keep d1/d2 filtered (exclude opposite)
  useEffect(() => {
    const all = currencies;
    let a1 = [...all];
    let dd1 = [...a1.splice(a1.indexOf(valueSelect1), 1), ...a1];
    const e1 = dd1.indexOf(valueSelect2);
    if (e1 !== -1) dd1.splice(e1, 1);
    setD1(dd1);
    let a2 = [...all];
    let dd2 = [...a2.splice(a2.indexOf(valueSelect2), 1), ...a2];
    const e2 = dd2.indexOf(valueSelect1);
    if (e2 !== -1) dd2.splice(e2, 1);
    setD2(dd2);
  }, [valueSelect1, valueSelect2, currencies]);

  const handleChange1 = e => setValueSelect1(e.target.value);
  const handleChange2 = e => setValueSelect2(e.target.value);
  const handleExpanr = () => {
    setD1(d2);
    setD2(d1);
    const t1 = valueSelect1; const t2 = valueSelect2;
    setValueSelect1(t2);
    setValueSelect2(t1);
    const tv1 = valueText1; const tv2 = valueText2;
    setValueText1(tv2);
    setValueText2(tv1);
  };
  const handleConvert1 = () => { setTextField_On_1(true); setTextField_On_2(false); };
  const handleConvert2 = () => { setTextField_On_1(false); setTextField_On_2(true); };

  // calculation
  useEffect(() => {
    const rate = rates[valueSelect2];
    if (!rate) return;
    const c = (Number(valueText1) * rate).toFixed(2);
    const d = (Number(valueText2) / rate).toFixed(2);
    if (textField_On_1) setValueText2(c);
    else if (textField_On_2) setValueText1(d);
  }, [rates, valueSelect1, valueSelect2, valueText1, valueText2, textField_On_1, textField_On_2]);

  const materialUITextFieldProps = {
    className: 'text-field',
    min: '0',
    variant: 'standard',
    step: '1.00',
  };

  const rate = rates[valueSelect2];

  return (
    <div className="converter-block" style={{ margin: 0, flex: '1 1 480px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        150+ валют · open.er-api.com / frankfurter
      </Typography>
      <Box className="text-field-block" component="form" noValidate autoComplete="off">
        <NumericFormat
          prefix={currencySign[valueSelect1] || `${valueSelect1} `}
          thousandSeparator=" "
          value={valueText1}
          onValueChange={values => { if (textField_On_1 !== undefined) setValueText1(values.value); }}
          onFocus={handleConvert1}
          customInput={TextField}
          {...materialUITextFieldProps}
        />
        <NumericFormat
          prefix={currencySign[valueSelect2] || `${valueSelect2} `}
          thousandSeparator=" "
          value={valueText2}
          onValueChange={values => { if (textField_On_2 !== undefined) setValueText2(values.value); }}
          onFocus={handleConvert2}
          customInput={TextField}
          {...materialUITextFieldProps}
        />
      </Box>
      <div className="currencyBTN">
        <FormControl className="currency-select" variant="filled">
          <InputLabel id="demo-simple-select-enhanced-1">Валюта</InputLabel>
          <Select labelId="demo-simple-select-enhanced-1" value={valueSelect1} onChange={handleChange1} label="Converter">
            {d1.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </Select>
        </FormControl>
        <IconButton className="currency-btn-revert" color="primary" onClick={handleExpanr}>
          <AutorenewIcon />
        </IconButton>
        <FormControl className="currency-select" variant="filled">
          <InputLabel id="demo-simple-select-enhanced-2">Валюта</InputLabel>
          <Select labelId="demo-simple-select-enhanced-2" value={valueSelect2} onChange={handleChange2} label="Converter">
            {d2.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
          Курс {valueSelect1} → {valueSelect2}
        </Typography>
        <Typography sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>
          {rate ? `1 ${valueSelect1} = ${Number(rate).toFixed(4)} ${valueSelect2}` : '—'}
        </Typography>
      </Box>
    </div>
  );
};
