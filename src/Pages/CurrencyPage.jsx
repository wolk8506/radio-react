import { CurrencyNBU } from '../Pages/Currency/CurrencyNBU';
import { CurrencyZVR } from '../Pages/Currency/CurrencyZVR';
import { CurrencyMono } from '../Pages/Currency/CurrencyMono';
import { CurrencyHistory } from '../Pages/Currency/CurrencyHistory';
import { CurrencyCrypto } from '../Pages/Currency/CurrencyCrypto';
import { CurrencyBanks } from '../Pages/Currency/CurrencyBanks';

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
