import { CurrencyNBU } from '../components/Currency/CurrencyNBU';
import { CurrencyZVR } from '../components/Currency/CurrencyZVR';
import { CurrencyMono } from '../components/Currency/CurrencyMono';
import { CurrencyHistory } from '../components/Currency/CurrencyHistory';
import { CurrencyCrypto } from '../components/Currency/CurrencyCrypto';
import { CurrencyBanks } from '../components/Currency/CurrencyBanks';

export const CurrencyPage = () => {
  return (
    <div className="container-curency">
      <CurrencyCrypto />
      <CurrencyBanks />
      <CurrencyMono></CurrencyMono>
      <CurrencyNBU></CurrencyNBU>
      <CurrencyHistory></CurrencyHistory>
      <CurrencyZVR></CurrencyZVR>
    </div>
  );
};
