import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  getKursTodayBanks,
  getMonoToday,
  getZVRCurrent,
  getZVRPrevious,
} from 'store/thunks';

import { CurrencyNBU } from './CurrencyNBU';
import { CurrencyZVR } from './CurrencyZVR';
import { CurrencyMono } from './CurrencyMono';
import { CurrencyBanks } from './CurrencyBanks';

export const CurrencyIndex = () => {
  const dispatch = useDispatch();

  // Запрос курса валют моно банк
  useEffect(() => {
    console.log(11);
    dispatch(getMonoToday());
    dispatch(getKursTodayBanks());
    dispatch(getZVRPrevious());
    dispatch(getZVRCurrent());
    console.log(22);
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
