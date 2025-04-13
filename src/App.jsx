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
} from 'store/selectors';

import { Main } from './components/Main/Main';
import { CurrencyIndex } from './components/Currency/Currency-index';
import { Weather } from './components/Weather/Weather';
import { RecipesIndex } from './components/Recipes/Recipes-index';
import { News } from './components/News/News';
import { Cakes } from './components/Recipes/Recipes';
import { Cake } from './components/Recipes/Recipe';
import { info } from './components/info';
import { radioData } from './components/Main/Radio-data';
import { Info } from './components/Info/Info';
import { SidebarDesctop } from './components/Sidebar/Sidebar-desctop';
import { SidebarMobile } from './components/Sidebar/Sidebar-mobile';

import { NotFoundView } from './Pages/NotFoundView';

export const App = () => {
  const PLAYER_PLAY = useSelector(getPlayerPlay);
  const PLAYER_STATION = useSelector(getPlayerStation);
  const [audio, setAudio] = useState();

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
            <Route path="/" element={<Main onAudio={audio} />} />
            <Route path="/currency-index" element={<CurrencyIndex />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/recipes" element={<RecipesIndex />} />
            <Route path="/news" element={<News />} />
            <Route path="/recipes/:cakesID" element={<Cakes />} />
            <Route path="/recipes/:cakesID/:cakeID" element={<Cake />} />
            <Route path="/info" element={<Info />} />
            <Route path="/404" element={<NotFoundView />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

console.log(info, 'font-family:monospace;color:#1976d2;font-size:12px;');
