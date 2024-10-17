//
// *    Курс валют Mono bank
//
export const getCurrencyMonoCurrent_Loading = state => state.storeCurrencyMonoCurrent.loading;
export const getCurrencyMonoCurrent_Status = state => state.storeCurrencyMonoCurrent.status;
export const getCurrencyMonoCurrent_TimeUpdate = state => state.storeCurrencyMonoCurrent.timeUpdate;
export const getCurrencyMonoCurrent_Data = state => state.storeCurrencyMonoCurrent.data;
//
// *    Курс валют в банках на сегодня
//
export const getCurrencyBanksToday_Loading = state => state.storeCurrencyBanksToday.loading;
export const getCurrencyBanksToday_Status = state => state.storeCurrencyBanksToday.status;
export const getCurrencyBanksToday_TimeUpdate = state => state.storeCurrencyBanksToday.timeUpdate;
export const getCurrencyBanksToday_Data = state => state.storeCurrencyBanksToday.data;
//
// *    Курс валют НБУ на сегодни и завтра
//
export const getCurrencyNBUtomorrow_Loading = state => state.storeCurrencyNBU.loading_tomorrow;
export const getCurrencyNBUtomorrow_Status = state => state.storeCurrencyNBU.status_tomorrow;
export const getCurrencyNBUtomorrow_TimeUpdate = state => state.storeCurrencyNBU.timeUpdate_tomorrow;
export const getCurrencyNBUtomorrow_Data = state => state.storeCurrencyNBU.data_tomorrow;
//
export const getCurrencyNBUtoday_Loading = state => state.storeCurrencyNBU.loading_today;
export const getCurrencyNBUtoday_Status = state => state.storeCurrencyNBU.status_today;
export const getCurrencyNBUtoday_TimeUpdate = state => state.storeCurrencyNBU.timeUpdate_today;
export const getCurrencyNBUtoday_Data = state => state.storeCurrencyNBU.data_today;
//
// *    Золотовалютные резервы за предыдущий месяц
//
export const getCurrencyZVRPrevious_Loading = state => state.storeCurrencyZVRPrevious.loading;
export const getCurrencyZVRPrevious_Status = state => state.storeCurrencyZVRPrevious.status;
export const getCurrencyZVRPrevious_TimeUpdate = state => state.storeCurrencyZVRPrevious.timeUpdate;
export const getCurrencyZVRPrevious_Data = state => state.storeCurrencyZVRPrevious.data;
//
// *    Золотовалютные резервы за текущий месяц
//
export const getCurrencyZVRCurrent_Loading = state => state.storeCurrencyZVRCurrent.loading;
export const getCurrencyZVRCurrent_Status = state => state.storeCurrencyZVRCurrent.status;
export const getCurrencyZVRCurrent_TimeUpdate = state => state.storeCurrencyZVRCurrent.timeUpdate;
export const getCurrencyZVRCurrent_Data = state => state.storeCurrencyZVRCurrent.data;
//
