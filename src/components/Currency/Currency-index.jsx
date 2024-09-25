import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMonoToday } from 'store/thunks';

import { CurrencyNBU } from './CurrencyNBU';
import { CurrencyZVR } from './CurrencyZVR';
import { CurrencyMono } from './CurrencyMono';
import { CurrencyBanks } from './CurrencyBanks';

export const CurrencyIndex = () => {
  const dispatch = useDispatch();

  // Запрос курса валют моно банк
  useEffect(() => {
    dispatch(getMonoToday());
  }, [dispatch]);

  return (
    <div>
      <CurrencyMono></CurrencyMono>
      <CurrencyBanks></CurrencyBanks>
      <CurrencyNBU></CurrencyNBU>
      <CurrencyZVR></CurrencyZVR>
    </div>
  );
};
