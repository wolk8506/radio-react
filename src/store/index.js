import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { data, weatherElements, weather15Reducer, weatherAirQualityReducer } from './reducer';

import weatherDay from './reducer-WeatherDay';
import currencyZVRPreviousReducer from './reducer-CurrencyZVRPrevious';
import currencyZVRCurrentReducer from './reducer-CurrencyZVRCurrent';
import currencyNBUReducer from './reducer-CurrencyNBU';
import currencyBanksTodayReducer from './reducer-CurrencyBanksToday';
import currencyMonoCurrentReducer from './reducer-CurrencyMonoCurrent';

export const rootReducer = combineReducers({
  storeData: data,
  storeWeatherElements: weatherElements,
  storeWeather15: weather15Reducer,
  storeWeatherAirQuality: weatherAirQualityReducer,
  //
  storeWeatherDay: weatherDay,
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
