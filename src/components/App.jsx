import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Media from 'react-media';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';

import { useTheme } from 'hooks/use-theme';
import { useBackground } from 'hooks/use-background';
import { useTransporantClock } from 'hooks/use-transporant-clock';

import { RadioMini } from './Main/Radio-mini';
import { Main } from './Main/Main';
import { CurrencyIndex } from './Currency/Currency-index';
import { Weather } from './Weather/Weather';
import { RecipesIndex } from './Recipes/Recipes-index';
import { News } from './News/News';

import { Cakes } from './Recipes/Recipes';
import { Cake } from './Recipes/Recipe';

import { info } from './info';

import {
  getThemeChengeTheme,
  getThemeChengeWalpaper,
  getPlayerPlay,
  getPlayerStation,
  getThemeTransporantClock,
} from 'store/selectors';

import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import InfoIcon from '@mui/icons-material/Info';
import { Info } from './Info/Info';
import IconButton from '@mui/material/IconButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import NewspaperIcon from '@mui/icons-material/Newspaper';

export const App = () => {
  const PLAYER_PLAY = useSelector(getPlayerPlay);
  const PLAYER_STATION = useSelector(getPlayerStation);
  const [audio, setAudio] = useState();
  const [btnTab, setBtnTab] = useState(0);
  const [btnMenu, setBtnMenu] = useState(false);
  const [btnMenuMobile, setBtnMenuMobile] = useState(true);

  const [classBtn_0, setClassBtn_0] = useState('navigation-btn toggle');
  const [classBtn_1, setClassBtn_1] = useState('navigation-btn toggle');
  const [classBtn_2, setClassBtn_2] = useState('navigation-btn toggle');
  const [classBtn_3, setClassBtn_3] = useState('navigation-btn toggle');
  const [classBtn_4, setClassBtn_4] = useState('navigation-btn toggle');
  const [classBtn_5, setClassBtn_5] = useState('navigation-btn toggle');
  const [classBtn_menu, setClassBtn_menu] = useState('');
  const radioStationName = [
    'Rock 181',
    'SOUNDPARK DEEP',
    'Радио Energy',
    'KissFM_HD',
    'Europa Plus',
    'Радио 7',
    'Русский Рок',
    'Record Rock',
    'Rock Radio',
    'Радио Максимум',
    'DFM',
    'Kiss FM Deep',
  ];

  useEffect(() => {
    PLAYER_PLAY ? (document.title = `Radio`) : (document.title = `${radioStationName[PLAYER_STATION]}`);
  });

  const handleBtnTab = e => {
    setBtnTab(Number(e.currentTarget.value));
    setBtnMenuMobile(!btnMenuMobile);
  };

  const handleMenu = () => {
    setBtnMenu(!btnMenu);
  };

  useEffect(() => {
    setClassBtn_menu(`${btnMenu ? 'menu_on' : ''}`);
  }, [btnMenu]);

  useEffect(() => setAudio(new Audio()), []);

  const toolbarTitle = ['Главная', 'Курс валют', 'Погода', 'Рецепты', 'Инфо'];

  useEffect(() => {
    setClassBtn_0(btnTab === 0 ? 'activ' : '');
    setClassBtn_1(btnTab === 1 ? 'activ' : '');
    setClassBtn_2(btnTab === 2 ? 'activ' : '');
    setClassBtn_3(btnTab === 3 ? 'activ' : '');
    setClassBtn_4(btnTab === 4 ? 'activ' : '');
    setClassBtn_5(btnTab === 5 ? 'activ' : '');
  }, [btnTab]);

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

  // useTransporantClock
  // *  --------------------------------------------------------------
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = anchor => (
    <Box role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        <ListItem value="0" onClick={handleBtnTab} component={Link} to={'/'}>
          <ListItemButton className={classBtn_0}>Главная</ListItemButton>
        </ListItem>
        <ListItem value="1" onClick={handleBtnTab} component={Link} to={'/currency-index'}>
          <ListItemButton className={classBtn_1}>Курс валют</ListItemButton>
        </ListItem>

        <ListItem value="2" onClick={handleBtnTab} component={Link} to={'/weather'}>
          <ListItemButton className={classBtn_2}>Погода</ListItemButton>
        </ListItem>

        <ListItem value="3" onClick={handleBtnTab} component={Link} to={'/recipes'}>
          <ListItemButton className={classBtn_3}>Рецепты</ListItemButton>
        </ListItem>

        <ListItem value="4" onClick={handleBtnTab} component={Link} to={'/news'}>
          <ListItemButton className={classBtn_4}>Новости</ListItemButton>
        </ListItem>

        <ListItem value="5" onClick={handleBtnTab} component={Link} to={'/info'}>
          <ListItemButton className={classBtn_5}>Инфо</ListItemButton>
        </ListItem>
      </List>

      {/* <Divider /> */}
    </Box>
  );

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
            {matches.small && (
              <>
                <Box sx={{ flexGrow: 1 }}>
                  <AppBar position="fixed" color="primary" sx={{ top: 0, bottom: 'auto' }}>
                    <Toolbar variant="dense">
                      <IconButton edge="start" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer('right', true)}>
                        <MenuIcon />
                      </IconButton>
                      <Typography variant="h6" color="inherit" component="div">
                        {toolbarTitle[btnTab]}
                      </Typography>
                    </Toolbar>
                  </AppBar>
                </Box>
                <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
                  {list('right')}
                </Drawer>
              </>
            )}

            {matches.large && (
              <div className={`sidebar ${classBtn_menu}`}>
                <div className="menu-btn">
                  <IconButton className="navigation-btn" onClick={handleMenu}>
                    {btnMenu ? <MenuOpenIcon className="btn-ico" /> : <MenuIcon className="btn-ico" />}
                  </IconButton>
                  <List>
                    <RadioMini onAudio={audio} open={btnMenu}></RadioMini>
                  </List>

                  <List>
                    <ListItem
                      className={classBtn_0}
                      value="0"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        component={Link}
                        to={'/'}
                        sx={[
                          { minHeight: 48, px: 2.5 },
                          btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        ]}
                      >
                        <ListItemIcon
                          sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}
                        >
                          <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Главная" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={classBtn_1}
                      value="1"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        component={Link}
                        to={'/currency-index'}
                        sx={[
                          { minHeight: 48, px: 2.5 },
                          btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        ]}
                      >
                        <ListItemIcon
                          sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}
                        >
                          <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText primary="Курс валют" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={classBtn_2}
                      value="2"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        component={Link}
                        to={'/weather'}
                        sx={[
                          { minHeight: 48, px: 2.5 },
                          btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        ]}
                      >
                        <ListItemIcon
                          sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}
                        >
                          <ThunderstormIcon />
                        </ListItemIcon>
                        <ListItemText primary="Погода" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={classBtn_3}
                      value="3"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        component={Link}
                        to={'/recipes'}
                        sx={[
                          { minHeight: 48, px: 2.5 },
                          btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        ]}
                      >
                        <ListItemIcon
                          sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}
                        >
                          <FastfoodIcon />
                        </ListItemIcon>
                        <ListItemText primary="Рецепты" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={classBtn_4}
                      value="4"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        component={Link}
                        to={'/news'}
                        sx={[
                          { minHeight: 48, px: 2.5 },
                          btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        ]}
                      >
                        <ListItemIcon
                          sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}
                        >
                          <NewspaperIcon />
                        </ListItemIcon>
                        <ListItemText primary="Новости" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={classBtn_5}
                      value="5"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        component={Link}
                        to={'/info'}
                        sx={[
                          { minHeight: 48, px: 2.5 },
                          btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        ]}
                      >
                        <ListItemIcon
                          sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}
                        >
                          <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary="Инфо" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Media>
      <div className="content">
        <Suspense fallback="Load...">
          {/* <Header /> */}

          <Routes>
            <Route path="/" element={<Main onAudio={audio} />} />
            <Route path="/currency-index" element={<CurrencyIndex />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/recipes" element={<RecipesIndex />} />
            <Route path="/news" element={<News />} />

            {/* <Route path="/cocktails" element={<Coctails />} />
            <Route path="/cocktails/:cocktailID" element={<Coctail />} /> */}
            <Route path="/:cakesID" element={<Cakes />} />
            <Route path="/:cakesID/:cakeID" element={<Cake />} />
            {/* <Route path="/cakes" element={<Cakes />} />
            <Route path="/cakes/:cakeID" element={<Cake />} /> */}
            {/* <Route path="/meat" element={<Meats />} />
            <Route path="/meat/:meatID" element={<Meat />} />
            <Route path="/soup" element={<Soups />} />
            <Route path="/soup/:soupID" element={<Soup />} />
            <Route path="/salad" element={<Salads />} />
            <Route path="/salad/:saladID" element={<Salad />} />
            <Route path="/desert" element={<Deserts />} />
            <Route path="/desert/:desertID" element={<Desert />} />
            <Route path="/zakuski" element={<Zakuskis />} />
            <Route path="/zakuski/:zakuskiID" element={<Zakuski />} />
            <Route path="/sousy" element={<Sousys />} />
            <Route path="/sousy/:sousyID" element={<Sousy />} />
            <Route path="/zagotovki" element={<Zagotovkis />} />
            <Route path="/zagotovki/:zagotovkiID" element={<Zagotovki />} /> */}

            <Route path="/info" element={<Info />} />
          </Routes>
        </Suspense>

        {/* {btnTab === 0 && <Main onAudio={audio}></Main>}
        {btnTab === 1 && <CurrencyIndex></CurrencyIndex>}
        {btnTab === 2 && <Weather></Weather>}
        {btnTab === 3 && <Info></Info>} */}
      </div>
    </div>
  );
};

console.log(info, 'font-family:monospace;color:#1976d2;font-size:12px;');
