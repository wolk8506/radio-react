import { CurrencyNBU } from '../components/Currency/CurrencyNBU';
import { CurrencyZVR } from '../components/Currency/CurrencyZVR';
import { CurrencyMono } from '../components/Currency/CurrencyMono';
import { CurrencyHistory } from '../components/Currency/CurrencyHistory';

export const CurrencyPage = () => {
  return (
    <div className="container-curency">
      <CurrencyMono></CurrencyMono>
      <CurrencyNBU></CurrencyNBU>
      <CurrencyHistory></CurrencyHistory>
      <CurrencyZVR></CurrencyZVR>
    </div>
  );
};
