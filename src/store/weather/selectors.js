//
const getWeatherDayCity1_Data = state => state.weather.weatherCity1.data;
const getWeatherDayCity2_Data = state => state.weather.weatherCity2.data;
const getWeatherDayCity3_Data = state => state.weather.weatherCity3.data;

const getCityName = state => state.weather.city;
const getCityList = state => state.weather.cityList;

//
const getWeatherAirQuality_Data = state => state.weather.weatherAirQuality.data;
const getWeatherElements_Data = state => state.weather.weatherElements.data;
const getWeatherMonth_Data = state => state.weather.weatherMonth.data;
const getWeatherWeek_Data = state => state.weather.weatherWeek.data;
const getWeatherMonth_TimeUpdate = state => state.weather.weatherMonth.timeUpdate;

//
// const getWeatherYesterday_Loading = state => state.weather.weatherYesterday.loading;
// const getWeatherYesterday_Status = state => state.weather.weatherYesterday.status;
// const getWeatherYesterday_TimeUpdate = state => state.weather.weatherYesterday.timeUpdate;
// const getWeatherYesterday_Data = state => state.weather.weatherYesterday.data;
//
const getWeatherToday_Loading = state => state.weather.weatherToday.loading;
const getWeatherToday_Status = state => state.weather.weatherToday.status;
const getWeatherToday_TimeUpdate = state => state.weather.weatherToday.timeUpdate;
const getWeatherToday_Data = state => state.weather.weatherToday.data;
const getWeatherToday_Error = state => state.weather.weatherToday.error;
//
// const getWeatherTomorrow_Loading = state => state.weather.weatherTomorrow.loading;
// const getWeatherTomorrow_Status = state => state.weather.weatherTomorrow.status;
// const getWeatherTomorrow_TimeUpdate = state => state.weather.weatherTomorrow.timeUpdate;
// const getWeatherTomorrow_Data = state => state.weather.weatherTomorrow.data;

export const weatherSelectors = {
  getWeatherDayCity1_Data,
  getWeatherDayCity2_Data,
  getWeatherDayCity3_Data,
  getCityName,
  getCityList,
  //
  getWeatherWeek_Data,
  //
  getWeatherAirQuality_Data,
  getWeatherElements_Data,
  getWeatherMonth_Data,
  getWeatherMonth_TimeUpdate,
  //
  // getWeatherYesterday_Loading,
  // getWeatherYesterday_Status,
  // getWeatherYesterday_TimeUpdate,
  // getWeatherYesterday_Data,
  //
  getWeatherToday_Loading,
  getWeatherToday_Status,
  getWeatherToday_TimeUpdate,
  getWeatherToday_Data,
  getWeatherToday_Error,
  //
  // getWeatherTomorrow_Loading,
  // getWeatherTomorrow_Status,
  // getWeatherTomorrow_TimeUpdate,
  // getWeatherTomorrow_Data,
};
