import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import weatherDayReducer from './reducer-WeatherDay';
import currencyZVRPreviousReducer from './reducer-CurrencyZVRPrevious';
import currencyZVRCurrentReducer from './reducer-CurrencyZVRCurrent';
import currencyNBUReducer from './reducer-CurrencyNBU';
import currencyBanksTodayReducer from './reducer-CurrencyBanksToday';
import currencyMonoCurrentReducer from './reducer-CurrencyMonoCurrent';
import dataReducer from './reducer-Data';
import weatherMonthReducer from './reducer-WeatherMonth';
import weatherAirQualityReducer from './reducer-WeatherAirQuality';
import weatherElementsReducer from './reducer-WeatherElements';
import weatherDayCityReducer from './reducer-WeatherDayCity';

export const rootReducer = combineReducers({
  storeWeatherElements: weatherElementsReducer,
  storeWeatherMonth: weatherMonthReducer,
  storeWeatherAirQuality: weatherAirQualityReducer,
  storeWeatherDayCity: weatherDayCityReducer,
  //
  storeData: dataReducer,
  //
  storeWeatherDay: weatherDayReducer,
  storeCurrencyMonoCurrent: currencyMonoCurrentReducer,
  storeCurrencyZVRPrevious: currencyZVRPreviousReducer,
  storeCurrencyZVRCurrent: currencyZVRCurrentReducer,
  storeCurrencyNBU: currencyNBUReducer,
  storeCurrencyBanksToday: currencyBanksTodayReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
