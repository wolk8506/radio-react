const getPlayerStation = state => state.root.playerStation;
const getPlayerPlay = state => state.root.playerPlay;
const getThemeChengeTheme = state => state.root.themeChengeTheme;
const getThemeAutoChengeTheme = state => state.root.themeAutoChengeTheme;
const getThemeChengeWalpaper = state => state.root.themeChengeWalpaper;
const getThemeWalpaper = state => state.root.themeWalpaper;
const getThemeWidgetClock = state => state.root.themeWidgetClock;
const getThemeIconWeather = state => state.root.themeIconWeather;
const getThemeTransporantClock = state => state.root.themeTransporantClock;
const getThemeClock_AnalogDigital = state => state.root.themeClock_AnalogDigital;
const getThemeNewYear = state => state.root.themeNewYear;

export const rootSelectors = {
  getPlayerStation,
  getPlayerPlay,
  getThemeChengeTheme,
  getThemeAutoChengeTheme,
  getThemeChengeWalpaper,
  getThemeWalpaper,
  getThemeWidgetClock,
  getThemeIconWeather,
  getThemeTransporantClock,
  getThemeClock_AnalogDigital,
  getThemeNewYear,
};
