//
export const getWeatherDayCity1_Data = state => state.root.storeWeatherDayCity.data_city1;
export const getWeatherDayCity2_Data = state => state.root.storeWeatherDayCity.data_city2;
export const getWeatherDayCity3_Data = state => state.root.storeWeatherDayCity.data_city3;

//
export const getPlayerStation = state => state.root.storeData.playerStation;
export const getPlayerPlay = state => state.root.storeData.playerPlay;
export const getCurrencyYesterday = state => state.root.storeData.currencyYesterday;
export const getThemeChengeTheme = state => state.root.storeData.themeChengeTheme;
export const getThemeAutoChengeTheme = state => state.root.storeData.themeAutoChengeTheme;
export const getThemeChengeWalpaper = state => state.root.storeData.themeChengeWalpaper;
export const getThemeWidgetClock = state => state.root.storeData.themeWidgetClock;
export const getThemeIconWeather = state => state.root.storeData.themeIconWeather;
export const getThemeTransporantClock = state => state.root.storeData.themeTransporantClock;
export const getThemeClock_AnalogDigital = state => state.root.storeData.themeClock_AnalogDigital;
export const getThemeNewYear = state => state.root.storeData.themeNewYear;
// themeClock_AnalogDigital

export const getCityName = state => state.root.storeData.city;
export const getCityList = state => state.root.storeData.cityList;

//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   П о г о д а -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
// *    Погода вчера / сегодня / завтра
//
export const getWeatherAirQuality_Data = state => state.root.storeWeatherAirQuality.data;
export const getWeatherElements_Data = state => state.root.storeWeatherElements.data;
export const getWeatherMonth_Data = state => state.root.storeWeatherMonth.data;
export const getWeatherMonth_TimeUpdate = state => state.root.storeWeatherMonth.timeUpdate;

//
export const getWeatherYesterday_Loading = state => state.root.storeWeatherDay.loading_yesterday;
export const getWeatherYesterday_Status = state => state.root.storeWeatherDay.status_yesterday;
export const getWeatherYesterday_TimeUpdate = state => state.root.storeWeatherDay.timeUpdate_yesterday;
export const getWeatherYesterday_Data = state => state.root.storeWeatherDay.data_yesterday;
//
export const getWeatherToday_Loading = state => state.root.storeWeatherDay.loading_today;
export const getWeatherToday_Status = state => state.root.storeWeatherDay.status_today;
export const getWeatherToday_TimeUpdate = state => state.root.storeWeatherDay.timeUpdate_today;
export const getWeatherToday_Data = state => state.root.storeWeatherDay.data_today;
export const getWeatherToday_Error = state => state.root.storeWeatherDay.error_today;
//
export const getWeatherTomorrow_Loading = state => state.root.storeWeatherDay.loading_tomorrow;
export const getWeatherTomorrow_Status = state => state.root.storeWeatherDay.status_tomorrow;
export const getWeatherTomorrow_TimeUpdate = state => state.root.storeWeatherDay.timeUpdate_tomorrow;
export const getWeatherTomorrow_Data = state => state.root.storeWeatherDay.data_tomorrow;

//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   К у р с   в а л ю т -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
// *    Курс валют Mono bank
//
export const getCurrencyMonoCurrent_Loading = state => state.root.storeCurrencyMonoCurrent.loading;
export const getCurrencyMonoCurrent_Status = state => state.root.storeCurrencyMonoCurrent.status;
export const getCurrencyMonoCurrent_TimeUpdate = state => state.root.storeCurrencyMonoCurrent.timeUpdate;
export const getCurrencyMonoCurrent_Data = state => state.root.storeCurrencyMonoCurrent.data;
//
// *    Курс валют в банках на сегодня
//
export const getCurrencyBanksToday_Loading = state => state.root.storeCurrencyBanksToday.loading;
export const getCurrencyBanksToday_Status = state => state.root.storeCurrencyBanksToday.status;
export const getCurrencyBanksToday_TimeUpdate = state => state.root.storeCurrencyBanksToday.timeUpdate;
export const getCurrencyBanksToday_Data = state => state.root.storeCurrencyBanksToday.data;
//
// *    Курс валют НБУ на сегодни и завтра
//
export const getCurrencyNBUtomorrow_Loading = state => state.root.storeCurrencyNBU.loading_tomorrow;
export const getCurrencyNBUtomorrow_Status = state => state.root.storeCurrencyNBU.status_tomorrow;
export const getCurrencyNBUtomorrow_TimeUpdate = state => state.root.storeCurrencyNBU.timeUpdate_tomorrow;
export const getCurrencyNBUtomorrow_Data = state => state.root.storeCurrencyNBU.data_tomorrow;
//
export const getCurrencyNBUtoday_Loading = state => state.root.storeCurrencyNBU.loading_today;
export const getCurrencyNBUtoday_Status = state => state.root.storeCurrencyNBU.status_today;
export const getCurrencyNBUtoday_TimeUpdate = state => state.root.storeCurrencyNBU.timeUpdate_today;
export const getCurrencyNBUtoday_Data = state => state.root.storeCurrencyNBU.data_today;
//
// *    Золотовалютные резервы за предыдущий месяц
//
export const getCurrencyZVRPrevious_Loading = state => state.root.storeCurrencyZVRPrevious.loading;
export const getCurrencyZVRPrevious_Status = state => state.root.storeCurrencyZVRPrevious.status;
export const getCurrencyZVRPrevious_TimeUpdate = state => state.root.storeCurrencyZVRPrevious.timeUpdate;
export const getCurrencyZVRPrevious_Data = state => state.root.storeCurrencyZVRPrevious.data;
//
// *    Золотовалютные резервы за текущий месяц
//
export const getCurrencyZVRCurrent_Loading = state => state.root.storeCurrencyZVRCurrent.loading;
export const getCurrencyZVRCurrent_Status = state => state.root.storeCurrencyZVRCurrent.status;
export const getCurrencyZVRCurrent_TimeUpdate = state => state.root.storeCurrencyZVRCurrent.timeUpdate;
export const getCurrencyZVRCurrent_Data = state => state.root.storeCurrencyZVRCurrent.data;
//
//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   К у р с   в а л ю т -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
//  -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
// *    Курс валют Mono bank
//
export const getNews_Loading = state => state.root.storeNews.loading;
export const getNews_Status = state => state.root.storeNews.status;
export const getNews_TimeUpdate = state => state.root.storeNews.timeUpdate;
export const getNews_Data = state => state.root.storeNews.data;
