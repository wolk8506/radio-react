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
  data,
  currencyNBUtodayReducer,
  currencyMonoTodayReducer,
  currencyNBUtomorrowReducer,
  currencyZVRPreviousReducer,
  currencyZVRCurrentReducer,
  weatherElements,
  weather15Reducer,
  weatherLastDayReducer,
} from './reducer';

export const rootReducer = combineReducers({
  storeKursTodayBanks: kursTodayBanksReducer,
  storeData: data,
  storeWeatherElements: weatherElements,
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
