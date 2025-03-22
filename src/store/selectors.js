//
export const getWeatherDayCity1_Data = state => state.storeWeatherDayCity.data_city1;
export const getWeatherDayCity2_Data = state => state.storeWeatherDayCity.data_city2;
export const getWeatherDayCity3_Data = state => state.storeWeatherDayCity.data_city3;

//
export const getPlayerStation = state => state.storeData.playerStation;
export const getPlayerPlay = state => state.storeData.playerPlay;
export const getCurrencyYesterday = state => state.storeData.currencyYesterday;
export const getThemeChengeTheme = state => state.storeData.themeChengeTheme;
export const getThemeAutoChengeTheme = state => state.storeData.themeAutoChengeTheme;
export const getThemeChengeWalpaper = state => state.storeData.themeChengeWalpaper;
export const getThemeWidgetClock = state => state.storeData.themeWidgetClock;
export const getThemeIconWeather = state => state.storeData.themeIconWeather;
export const getThemeTransporantClock = state => state.storeData.themeTransporantClock;
export const getThemeClock_AnalogDigital = state => state.storeData.themeClock_AnalogDigital;
export const getThemeNewYear = state => state.storeData.themeNewYear;
// themeClock_AnalogDigital

export const getCityName = state => state.storeData.city;
export const getCityList = state => state.storeData.cityList;

//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   П о г о д а -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
// *    Погода вчера / сегодня / завтра
//
export const getWeatherAirQuality_Data = state => state.storeWeatherAirQuality.data;
export const getWeatherElements_Data = state => state.storeWeatherElements.data;
export const getWeatherMonth_Data = state => state.storeWeatherMonth.data;
export const getWeatherMonth_TimeUpdate = state => state.storeWeatherMonth.timeUpdate;

//
export const getWeatherYesterday_Loading = state => state.storeWeatherDay.loading_yesterday;
export const getWeatherYesterday_Status = state => state.storeWeatherDay.status_yesterday;
export const getWeatherYesterday_TimeUpdate = state => state.storeWeatherDay.timeUpdate_yesterday;
export const getWeatherYesterday_Data = state => state.storeWeatherDay.data_yesterday;
//
export const getWeatherToday_Loading = state => state.storeWeatherDay.loading_today;
export const getWeatherToday_Status = state => state.storeWeatherDay.status_today;
export const getWeatherToday_TimeUpdate = state => state.storeWeatherDay.timeUpdate_today;
export const getWeatherToday_Data = state => state.storeWeatherDay.data_today;
export const getWeatherToday_Error = state => state.storeWeatherDay.error_today;
//
export const getWeatherTomorrow_Loading = state => state.storeWeatherDay.loading_tomorrow;
export const getWeatherTomorrow_Status = state => state.storeWeatherDay.status_tomorrow;
export const getWeatherTomorrow_TimeUpdate = state => state.storeWeatherDay.timeUpdate_tomorrow;
export const getWeatherTomorrow_Data = state => state.storeWeatherDay.data_tomorrow;

//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   К у р с   в а л ю т -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
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
