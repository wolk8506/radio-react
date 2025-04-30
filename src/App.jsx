import React, { Fragment, useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Media from 'react-media';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useTheme } from 'hooks/use-theme';
import { useBackground } from 'hooks/use-background';
import { useTransporantClock } from 'hooks/use-transporant-clock';
import {
  getThemeChengeTheme,
  getThemeChengeWalpaper,
  getPlayerPlay,
  getPlayerStation,
  getThemeTransporantClock,
} from 'store/root/selectors';
// import { authSelectors } from './store/auth/selectors';
import { fetchCurrentUser } from './store/auth/operations';

// Компоненты
import { Main } from './components/Main/Main';
import { CurrencyIndex } from './components/Currency/Currency-index';
import { Weather } from './components/Weather/Weather';
import { RecipesIndex } from './components/Recipes/RecipesMain';
import { RecipeAdd } from './components/Recipes/RecipeAdd';
import { News } from './components/News/News';
import { Recipes } from './components/Recipes/Recipes';
import { Recipe } from './components/Recipes/Recipe';
import { info } from './components/info';
import { radioData } from './components/Main/Radio-data';
import { Info } from './components/Info/InfoPage';
import { SidebarDesctop } from './components/Sidebar/Sidebar-desctop';
import { SidebarMobile } from './components/Sidebar/Sidebar-mobile';
import { PrivateRoute } from 'components/Route/PrivateRoute';
import { PublicRoute } from './components/Route/PublicRoute';
import { RecipeUpdate } from 'components/Recipes/RecipeUpdate';
import { LoginPage, RegisterPage, ProfilePage, NotFoundPage } from './Pages';
import { authSelectors } from 'store/auth/selectors';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Конфигурация маршрутов
const routes = [
  { path: '/', element: <Main />, isPublic: true },
  { path: '/currency-index', element: <CurrencyIndex />, isPublic: true },
  { path: '/weather', element: <Weather />, isPublic: true },
  { path: '/recipes', element: <RecipesIndex />, isPublic: true },
  { path: '/news', element: <News />, isPublic: true },
  { path: '/recipes/:recipesID', element: <Recipes />, isPublic: true },
  { path: '/recipes/:recipesID/:recipeID', element: <Recipe />, isPublic: true },
  { path: '/recipes/recipes-add', element: <RecipeAdd />, isPublic: false },
  { path: '/recipes/:recipesID/:recipeID/edit', element: <RecipeUpdate />, isPublic: false },
  { path: '/404', element: <NotFoundPage />, isPublic: true },
  { path: '*', element: <Navigate to="/404" replace />, isPublic: true },
  { path: '/settings', element: <Info />, isPublic: false },
  { path: '/profile', element: <ProfilePage />, isPublic: false },
  { path: '/register', element: <RegisterPage />, isPublic: true, restricted: true },
  { path: '/login', element: <LoginPage />, isPublic: true, restricted: true },
];

// Универсальная функция рендера маршрутов
const renderRoute = ({ path, element, isPublic, restricted }) => {
  const RouteWrapper = isPublic ? PublicRoute : PrivateRoute;
  return <Route key={path} path={path} element={<RouteWrapper restricted={restricted}>{element}</RouteWrapper>} />;
};

export const App = () => {
  const PLAYER_PLAY = useSelector(getPlayerPlay);
  const PLAYER_STATION = useSelector(getPlayerStation);
  const [audio, setAudio] = useState();

  const isFetching = useSelector(authSelectors.getIsFetchingCurrent);
  const dispatch = useDispatch();

  // Загрузка текущего пользователя
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Проверка токена в localStorage
    if (token) {
      dispatch(fetchCurrentUser()); // Загружаем данные пользователя при наличии токена
    }
  }, [dispatch]);

  useEffect(() => setAudio(new Audio()), []);
  useEffect(() => {
    PLAYER_PLAY ? (document.title = `Radio`) : (document.title = `${radioData[PLAYER_STATION]?.name}`);
  }, [PLAYER_PLAY, PLAYER_STATION]);

  // Работа с темами
  const { theme, setTheme } = useTheme();
  const THEME = useSelector(getThemeChengeTheme);
  useEffect(() => setTheme(THEME), [THEME, setTheme, theme]);

  const { themeBackground, setThemeBackground } = useBackground('color');
  const THEME_BACKGROUND = useSelector(getThemeChengeWalpaper);
  useEffect(() => setThemeBackground(THEME_BACKGROUND), [THEME_BACKGROUND, setThemeBackground, themeBackground]);

  const { themeTransporantClock, setThemeTransporantClock } = useTransporantClock('100%');
  const THEME_T_C = useSelector(getThemeTransporantClock);
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
    <div className="app">
      <Media
        queries={{
          small: '(max-width: 599px)',
          large: '(min-width: 600px)',
        }}
      >
        {matches => (
          <Fragment>
            {matches.small && <SidebarMobile />}
            {matches.large && <SidebarDesctop audio={audio} />}
          </Fragment>
        )}
      </Media>

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
