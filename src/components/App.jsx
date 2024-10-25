import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Media from 'react-media';
import { useTheme } from 'hooks/use-theme';
import { useBackground } from 'hooks/use-background';

import { RadioMini } from './Main/Radio-mini';
import { Main } from './Main/Main';
import { CurrencyIndex } from './Currency/Currency-index';
import { Weather } from './Weather/Weather';
import { info } from './info';

import DensityMediumIcon from '@mui/icons-material/DensityMedium';
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

export const App = () => {
  const PLAYER_PLAY = useSelector(state => state.storeData.playerPlay);
  const PLAYER_STATION = useSelector(state => state.storeData.playerStation);
  const [audio, setAudio] = useState();
  const [btnTab, setBtnTab] = useState(0);
  const [btnMenu, setBtnMenu] = useState(false);
  const [btnMenuMobile, setBtnMenuMobile] = useState(true);
  const [classListMenuMobile, setClassListMenuMobile] = useState('mobile-menu__list');
  const [classBtn_0, setClassBtn_0] = useState('navigation-btn toggle');
  const [classBtn_1, setClassBtn_1] = useState('navigation-btn toggle');
  const [classBtn_2, setClassBtn_2] = useState('navigation-btn toggle');
  const [classBtn_3, setClassBtn_3] = useState('navigation-btn toggle');
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

  const handleMenuMobile = () => {
    setBtnMenuMobile(!btnMenuMobile);
  };

  useEffect(() => {
    setClassListMenuMobile(`${btnMenuMobile ? 'mobile-menu__list--on mobile-menu__list' : 'mobile-menu__list'}`);
  }, [btnMenuMobile]);

  useEffect(() => {
    setClassBtn_menu(`${btnMenu ? 'menu_on' : ''}`);
  }, [btnMenu]);

  useEffect(() => setAudio(new Audio()), []);

  useEffect(() => {
    setClassBtn_0(btnTab === 0 ? 'activ' : '');
    setClassBtn_1(btnTab === 1 ? 'activ' : '');
    setClassBtn_2(btnTab === 2 ? 'activ' : '');
    setClassBtn_3(btnTab === 3 ? 'activ' : '');
  }, [btnTab]);

  // * Theme -----------------------------------

  // eslint-disable-next-line no-unused-vars
  const { theme, setTheme } = useTheme();

  const THEME = useSelector(state => state.storeData.theme);

  useEffect(() => {
    setTheme(THEME);
  }, [THEME, setTheme]);

  const { themeBackground, setThemeBackground } = useBackground();

  const THEME_BACKGROUND = useSelector(state => state.storeData.themeBackground);

  useEffect(() => {
    setThemeBackground(THEME_BACKGROUND);
  }, [THEME_BACKGROUND, setThemeBackground, themeBackground]);

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
              <div className="mobile-menu">
                <div className="mobile-menu__title">
                  <button type="button" onClick={handleMenuMobile}>
                    <DensityMediumIcon className="btn-ico"></DensityMediumIcon>
                  </button>
                </div>
                <div className={classListMenuMobile}>
                  <button type="button" value="0" onClick={handleBtnTab}>
                    <HomeIcon className="btn-ico" />
                    Главная
                  </button>
                  <button type="button" value="1" onClick={handleBtnTab}>
                    <AccountBalanceIcon className="btn-ico" />
                    Курс валют
                  </button>
                  <button type="button" value="2" onClick={handleBtnTab}>
                    <ThunderstormIcon className="btn-ico" />
                    Погода
                  </button>
                  <button type="button" value="3" onClick={handleBtnTab}>
                    <InfoIcon className="btn-ico" />
                    Инфо
                  </button>
                </div>
              </div>
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
                      key="qwee0"
                      value="0"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          btnMenu
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            btnMenu
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Главная"
                          sx={[
                            btnMenu
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={classBtn_1}
                      key="qwee4"
                      value="1"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
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
                        <ListItemText primary="Инфо" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                      </ListItemButton>
                    </ListItem>

                    <ListItem
                      className={classBtn_2}
                      key="qwee3"
                      value="2"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
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
                      key="qwee4"
                      value="3"
                      onClick={handleBtnTab}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
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
        {btnTab === 0 && <Main onAudio={audio}></Main>}
        {btnTab === 1 && <CurrencyIndex></CurrencyIndex>}
        {btnTab === 2 && <Weather></Weather>}
        {btnTab === 3 && <Info></Info>}
      </div>
    </div>
  );
};

console.log(info, 'font-family:monospace;color:#1976d2;font-size:12px;');
