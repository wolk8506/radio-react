const getCurrencyYesterday = state => state.root.currencyYesterday;

// *    Курс валют Mono bank
//
const getCurrencyMonoCurrent_Loading = state => state.currency.currencyMono.loading;
const getCurrencyMonoCurrent_Status = state => state.currency.currencyMono.status;
const getCurrencyMonoCurrent_TimeUpdate = state => state.currency.currencyMono.timeUpdate;
const getCurrencyMonoCurrent_Data = state => state.currency.currencyMono.data;
//
// *    Курс валют НБУ на сегодни и завтра
//
const getCurrencyNBUtomorrow_Loading = state => state.currency.currencyNBUtomorrow.loading;
const getCurrencyNBUtomorrow_Status = state => state.currency.currencyNBUtomorrow.status;
const getCurrencyNBUtomorrow_TimeUpdate = state => state.currency.currencyNBUtomorrow.timeUpdate;
const getCurrencyNBUtomorrow_Data = state => state.currency.currencyNBUtomorrow.data;
//
const getCurrencyNBUtoday_Loading = state => state.currency.currencyNBUtoday.loading;
const getCurrencyNBUtoday_Status = state => state.currency.currencyNBUtoday.status;
const getCurrencyNBUtoday_TimeUpdate = state => state.currency.currencyNBUtoday.timeUpdate;
const getCurrencyNBUtoday_Data = state => state.currency.currencyNBUtoday.data;
//
// *    Золотовалютные резервы за предыдущий месяц
//
const getCurrencyZVRPrevious_Loading = state => state.currency.currencyZVRPrevious.loading;
const getCurrencyZVRPrevious_Status = state => state.currency.currencyZVRPrevious.status;
const getCurrencyZVRPrevious_TimeUpdate = state => state.currency.currencyZVRPrevious.timeUpdate;
const getCurrencyZVRPrevious_Data = state => state.currency.currencyZVRPrevious.data;
//
// *    Золотовалютные резервы за текущий месяц
//
const getCurrencyZVRCurrent_Loading = state => state.currency.currencyZVRCurrent.loading;
const getCurrencyZVRCurrent_Status = state => state.currency.currencyZVRCurrent.status;
const getCurrencyZVRCurrent_TimeUpdate = state => state.currency.currencyZVRCurrent.timeUpdate;
const getCurrencyZVRCurrent_Data = state => state.currency.currencyZVRCurrent.data;
//

export const currencySelectors = {
  getCurrencyYesterday,
  getCurrencyMonoCurrent_Loading,
  getCurrencyMonoCurrent_Status,
  getCurrencyMonoCurrent_TimeUpdate,
  getCurrencyMonoCurrent_Data,
  getCurrencyNBUtomorrow_Loading,
  getCurrencyNBUtomorrow_Status,
  getCurrencyNBUtomorrow_TimeUpdate,
  getCurrencyNBUtomorrow_Data,
  getCurrencyNBUtoday_Loading,
  getCurrencyNBUtoday_Status,
  getCurrencyNBUtoday_TimeUpdate,
  getCurrencyNBUtoday_Data,
  getCurrencyZVRPrevious_Loading,
  getCurrencyZVRPrevious_Status,
  getCurrencyZVRPrevious_TimeUpdate,
  getCurrencyZVRPrevious_Data,
  getCurrencyZVRCurrent_Loading,
  getCurrencyZVRCurrent_Status,
  getCurrencyZVRCurrent_TimeUpdate,
  getCurrencyZVRCurrent_Data,
};
