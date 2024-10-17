import { CurrencyNBU } from './CurrencyNBU';
import { CurrencyZVR } from './CurrencyZVR';
import { CurrencyMono } from './CurrencyMono';
import { CurrencyBanks } from './CurrencyBanks';

export const CurrencyIndex = () => {
  return (
    <div>
      <CurrencyMono></CurrencyMono>
      <CurrencyBanks></CurrencyBanks>
      <CurrencyNBU></CurrencyNBU>
      <CurrencyZVR></CurrencyZVR>
    </div>
  );
};
