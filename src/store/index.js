import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  kursTodayBanksReducer,
  weatherCityReducer,
  currencyNBUtodayReducer,
  currencyMonoTodayReducer,
  currencyNBUtomorrowReducer,
  currencyZVRPreviousReducer,
  currencyZVRCurrentReducer,
  weatherReducer,
  weather15Reducer,
  weatherLastDayReducer,
} from './reducer';

// import { applyMiddleware, createStore } from 'redux';
// import { logger } from 'middleware/logger';
// import { sheduler } from 'middleware/scheduler';
// import { thunk } from 'redux-thunk';

export const rootReducer = combineReducers({
  storeKursTodayBanks: kursTodayBanksReducer,
  storeWeatherCity: weatherCityReducer,
  storeWeather: weatherReducer,
  storeWeather15: weather15Reducer,
  storeWeatherLastDay: weatherLastDayReducer,
  storeCurrencyMonoToday: currencyMonoTodayReducer,
  storeCurrencyNBUtoday: currencyNBUtodayReducer,
  storeCurrencyNBUtomorrow: currencyNBUtomorrowReducer,
  storeCurrencyZVRPrevious: currencyZVRPreviousReducer,
  storeCurrencyZVRCurrent: currencyZVRCurrentReducer,
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
