import React, { Fragment, useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import Media from 'react-media';
import { Routes, Route, Navigate } from 'react-router-dom';

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

import { Main } from './components/Main/Main';
import { CurrencyIndex } from './components/Currency/Currency-index';
import { Weather } from './components/Weather/Weather';
import { RecipesIndex } from './components/Recipes/Recipes-index';
import { RecipeAdd } from './components/Recipes/RecipeAdd';
import { News } from './components/News/News';
import { Recipes } from './components/Recipes/Recipes';
import { Recipe } from './components/Recipes/Recipe';
import { info } from './components/info';
import { radioData } from './components/Main/Radio-data';
import { Info } from './components/Info/Info';
import { SidebarDesctop } from './components/Sidebar/Sidebar-desctop';
import { SidebarMobile } from './components/Sidebar/Sidebar-mobile';
import { RegisterView } from './Pages/RegisterView';

import { NotFoundView } from './Pages/NotFoundView';
import { LoginView } from 'Pages/LoginView';
import { ToastContainer } from 'react-toastify';

import { PrivateRoute } from 'components/Route/PrivateRoute';
import { PublicRoute } from './components/Route/PublicRoute';
import { getIsLoggedIn } from './store/auth/selectors';
import { fetchCurrentUser } from './store/auth/operations';
import { useDispatch } from 'react-redux';
import { UserView } from 'Pages/UserView';
import { RecipeUpdate } from 'components/Recipes/RecipeUpdate';

export const App = () => {
  const PLAYER_PLAY = useSelector(getPlayerPlay);
  const PLAYER_STATION = useSelector(getPlayerStation);
  const [audio, setAudio] = useState();

  const dispatch = useDispatch();
  // const isFetchingCurrentUser = useSelector(getIsFetchingCurrent);
  const isLoggedIn = useSelector(getIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
    }
    dispatch(fetchCurrentUser());
  }, [dispatch, isLoggedIn]);

  useEffect(() => setAudio(new Audio()), []);
  useEffect(() => {
    PLAYER_PLAY ? (document.title = `Radio`) : (document.title = `${radioData[PLAYER_STATION].name}`);
  });

  // * Theme -----------------------------------
  // eslint-disable-next-line no-unused-vars
  const { theme, setTheme } = useTheme();
  const THEME = useSelector(getThemeChengeTheme);
  useEffect(() => {
    setTheme(THEME);
  }, [THEME, setTheme]);

  // eslint-disable-next-line no-unused-vars
  const { themeBackground, setThemeBackground } = useBackground('color');
  const THEME_BACKGROUND = useSelector(getThemeChengeWalpaper);
  useEffect(() => {
    setThemeBackground(THEME_BACKGROUND);
  }, [THEME_BACKGROUND, setThemeBackground]);

  // eslint-disable-next-line no-unused-vars
  const { themeTransporantClock, setThemeTransporantClock } = useTransporantClock('100%');
  const THEME_T_C = useSelector(getThemeTransporantClock);
  useEffect(() => {
    setThemeTransporantClock(THEME_T_C);
  }, [THEME_T_C, setThemeTransporantClock]);

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
            {matches.small && <SidebarMobile></SidebarMobile>}
            {matches.large && <SidebarDesctop audio={audio}></SidebarDesctop>}
          </Fragment>
        )}
      </Media>
      <div className="content">
        <Suspense fallback="Load...">
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Main onAudio={audio} />
                </PublicRoute>
              }
            />
            <Route
              path="/currency-index"
              element={
                <PublicRoute>
                  <CurrencyIndex />
                </PublicRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <PublicRoute>
                  <Weather />
                </PublicRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <PublicRoute>
                  <RecipesIndex />
                </PublicRoute>
              }
            />

            <Route
              path="/news"
              element={
                <PublicRoute>
                  <News />
                </PublicRoute>
              }
            />
            <Route
              path="/recipes/:recipesID"
              element={
                <PublicRoute>
                  <Recipes />
                </PublicRoute>
              }
            />
            <Route
              path="/recipes/:recipesID/:recipeID"
              element={
                <PublicRoute>
                  <Recipe />
                </PublicRoute>
              }
            />
            <Route
              path="/404"
              element={
                <PublicRoute>
                  <NotFoundView />
                </PublicRoute>
              }
            />
            <Route
              path="*"
              element={
                <PublicRoute>
                  <Navigate to="/404" replace />
                </PublicRoute>
              }
            />
            <Route
              path="/info"
              element={
                <PrivateRoute>
                  <Info />
                </PrivateRoute>
              }
            />
            <Route
              path="/recipes/recipes-add"
              element={
                <PrivateRoute>
                  <RecipeAdd />
                </PrivateRoute>
              }
            />
            <Route
              path="/recipes/:recipesID/:recipeID/edit"
              // /recipes/${item_ID}/${_ID}/edit
              element={
                <PrivateRoute>
                  <RecipeUpdate />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <UserView />
                </PrivateRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute restricted>
                  <RegisterView />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute restricted>
                  <LoginView />
                </PublicRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

console.log(info, 'font-family:monospace;color:#1976d2;font-size:12px;');
