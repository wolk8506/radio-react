import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authReducer } from 'store';
import recipeReducer from './recipe/reducer';
import weatherReducer from './weather/reducer';
import currencyReducer from './currency/reducer';
import newsReducer from './news/reducer';
import filesReducer from './files/reducer';
import rootReducer from './root/reducer';

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
const persistConfigWeather = {
  key: 'weather',
  storage,
};
const persistConfigCurrency = {
  key: 'currency',
  storage,
};
const persistConfigNews = {
  key: 'news',
  storage,
};
const persistConfigAuth = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

// Создаем persistedReducer
const persistedRootReducer = persistReducer(persistConfig, rootReducer);
const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistedRecipeReducer = persistReducer(persistConfigRecipe, recipeReducer);
const persistedRecipeFiles = persistReducer(persistConfigFiles, filesReducer);
const persistedWeather = persistReducer(persistConfigWeather, weatherReducer);
const persistedCurrency = persistReducer(persistConfigCurrency, currencyReducer);
const persistedNews = persistReducer(persistConfigNews, newsReducer);

const store = configureStore({
  reducer: {
    root: persistedRootReducer,
    recipe: persistedRecipeReducer,
    files: persistedRecipeFiles,
    auth: persistedAuthReducer,
    weather: persistedWeather,
    currency: persistedCurrency,
    news: persistedNews,
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
