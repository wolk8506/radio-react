import { CurrencyNBU } from '../components/Currency/CurrencyNBU';
import { CurrencyZVR } from '../components/Currency/CurrencyZVR';
import { CurrencyMono } from '../components/Currency/CurrencyMono';

export const CurrencyPage = () => {
  return (
    <div>
      <CurrencyMono></CurrencyMono>
      <CurrencyNBU></CurrencyNBU>
      <CurrencyZVR></CurrencyZVR>
    </div>
  );
};
