import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useTransporantClock, useTheme } from 'hooks';
import { authOperations, rootSelectors, authSelectors } from 'store';

// Компоненты
import { PrivateRoute, PublicRoute } from 'components/Routes';

import { info } from 'config';

import { Main } from './components/Main/Main';
import { Weather } from './components/Weather/Weather';
import { RecipesIndex } from './components/Recipes/RecipesMain';
import { RecipeAdd } from './components/Recipes/RecipeAdd';
import { News } from './components/News/News';
import { Recipes } from './components/Recipes/Recipes';
import { Recipe } from './components/Recipes/Recipe';
import { radioData } from './components/Main/Radio-data';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { RecipeUpdate } from 'components/Recipes/RecipeUpdate';
import { LoginPage, RegisterPage, ProfilePage, NotFoundPage, SettingsPage, CurrencyPage } from './Pages';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export const App = () => {
  const dynamicImageUrl = useSelector(rootSelectors.getThemeChengeWalpaper);
  const PLAYER_PLAY = useSelector(rootSelectors.getPlayerPlay);
  const PLAYER_STATION = useSelector(rootSelectors.getPlayerStation);
  const [audio, setAudio] = useState();
  const THEME_NEW_YEAR = useSelector(rootSelectors.getThemeNewYear);
  const isFetching = useSelector(authSelectors.getIsFetchingCurrent);
  const dispatch = useDispatch();

  // Конфигурация маршрутов
  const routes = [
    { path: '/', element: <Main onAudio={audio} />, isPublic: true },
    { path: '/currency-index', element: <CurrencyPage />, isPublic: true },
    { path: '/weather', element: <Weather />, isPublic: true },
    { path: '/recipes', element: <RecipesIndex />, isPublic: true },
    { path: '/news', element: <News />, isPublic: true },
    { path: '/recipes/:recipesID', element: <Recipes />, isPublic: true },
    { path: '/recipes/:recipesID/:recipeID', element: <Recipe />, isPublic: true },
    { path: '/recipes/recipes-add', element: <RecipeAdd />, isPublic: false },
    { path: '/recipes/:recipesID/:recipeID/edit', element: <RecipeUpdate />, isPublic: false },
    { path: '/404', element: <NotFoundPage />, isPublic: true },
    { path: '*', element: <Navigate to="/404" replace />, isPublic: true },
    { path: '/settings', element: <SettingsPage />, isPublic: false },
    { path: '/profile', element: <ProfilePage />, isPublic: false },
    { path: '/register', element: <RegisterPage />, isPublic: true, restricted: true },
    { path: '/login', element: <LoginPage />, isPublic: true, restricted: true },
  ];

  // Универсальная функция рендера маршрутов
  const renderRoute = ({ path, element, isPublic, restricted }) => {
    const RouteWrapper = isPublic ? PublicRoute : PrivateRoute;
    return <Route key={path} path={path} element={<RouteWrapper restricted={restricted}>{element}</RouteWrapper>} />;
  };

  // Загрузка текущего пользователя
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Проверка токена в localStorage
    if (token) {
      dispatch(authOperations.fetchCurrentUser()); // Загружаем данные пользователя при наличии токена
    }
  }, [dispatch]);

  useEffect(() => setAudio(new Audio()), []);
  useEffect(() => {
    PLAYER_PLAY ? (document.title = `Radio`) : (document.title = `${radioData[PLAYER_STATION]?.name}`);
  }, [PLAYER_PLAY, PLAYER_STATION]);

  // Работа с темами
  const { theme, setTheme } = useTheme();
  const THEME = useSelector(rootSelectors.getThemeChengeTheme);
  useEffect(() => setTheme(THEME), [THEME, setTheme, theme]);

  const { themeTransporantClock, setThemeTransporantClock } = useTransporantClock(100);
  const THEME_T_C = useSelector(rootSelectors.getThemeTransporantClock);
  useEffect(() => setThemeTransporantClock(THEME_T_C), [THEME_T_C, setThemeTransporantClock, themeTransporantClock]);

  if (isFetching) {
    // Пока идёт загрузка, показываем индикатор
    return (
      <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // Если загрузка завершена, рендерим приложение
  return (
    <div className="app" style={{ '--background-image': dynamicImageUrl }}>
      {THEME_NEW_YEAR.snow && (
        <div className="snow">
          {[...Array(200)].map((_, index) => (
            <div key={index} className="snow__snowflakes"></div>
          ))}
        </div>
      )}
      <Sidebar audio={audio} />
      <div className="content">
        <Suspense fallback="Load...">
          <Routes>{routes.map(renderRoute)}</Routes>
        </Suspense>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};
console.log(info, 'font-family:monospace;color:#1976d2;font-size:12px;');
