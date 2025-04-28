import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import weatherDayReducer from './root/reducer-WeatherDay';
import currencyZVRPreviousReducer from './root/reducer-CurrencyZVRPrevious';
import currencyZVRCurrentReducer from './root/reducer-CurrencyZVRCurrent';
import currencyNBUReducer from './root/reducer-CurrencyNBU';
// import currencyBanksTodayReducer from './root/reducer-CurrencyBanksToday';
import currencyMonoCurrentReducer from './root/reducer-CurrencyMonoCurrent';
import dataReducer from './root/reducer-Data';
import weatherMonthReducer from './root/reducer-WeatherMonth';
import weatherAirQualityReducer from './root/reducer-WeatherAirQuality';
import weatherElementsReducer from './root/reducer-WeatherElements';
import weatherDayCityReducer from './root/reducer-WeatherDayCity';
import newsReducer from './root/reducer-News';
import recipeReducer from './recipe/reducer';
import { auth as authReducer } from './auth/reducer';
import filesReducer from './files/reducer';
// import authReducer2 from './auth/reducer';

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
  // storeCurrencyBanksToday: currencyBanksTodayReducer,
  //
  storeNews: newsReducer,
  // storeAuth: authReducer2,
});

// export const authReducer = combineReducers({
//   storeAuth: auth,
// });

const persistConfig = {
  key: 'root',
  storage,
};
const persistConfigRecipe = {
  key: 'recipe',
  storage,
};
const persistConfigFiles = {
  key: 'files',
  storage,
};
const persistConfigAuth = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

// Создаем persistedReducer для root
const persistedRootReducer = persistReducer(persistConfig, rootReducer);

// Создаем persistedReducer для auth
const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
// Создаем persistedReducer для recipe
const persistedRecipeReducer = persistReducer(persistConfigRecipe, recipeReducer);
// Создаем persistedReducer для recipe
const persistedRecipeFiles = persistReducer(persistConfigFiles, filesReducer);

const store = configureStore({
  reducer: {
    root: persistedRootReducer, // Главный редюсер
    recipe: persistedRecipeReducer,
    files: persistedRecipeFiles,
    auth: persistedAuthReducer, // Редюсер для авторизации
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
