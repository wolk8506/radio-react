import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Media from 'react-media';
import { useTheme } from 'hooks/use-theme';

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

export const App = () => {
  const PLAYER_STATION = useSelector(state => state.storeData.playerStation);
  const [audio, setAudio] = useState();
  const [btnTab, setBtnTab] = useState('0');
  const [btnMenu, setBtnMenu] = useState(false);
  const [btnMenuMobile, setBtnMenuMobile] = useState(true);
  const [classListMenuMobile, setClassListMenuMobile] =
    useState('mobile-menu__list');
  const [classBtn_0, setClassBtn_0] = useState('navigation-btn toggle');
  const [classBtn_1, setClassBtn_1] = useState('navigation-btn toggle');
  const [classBtn_2, setClassBtn_2] = useState('navigation-btn toggle');
  const [classBtn_3, setClassBtn_3] = useState('navigation-btn toggle');
  const [classBtn_menu, setClassBtn_menu] = useState('');
  const [content_menuOpen, setContent_menuOpen] = useState('');
  const radioStationName = [
    'Rock 181',
    'SOUNDPARK DEEP',
    'Радио Energy',
    'KissFM_HD',
  ];

  const handleBtnTab = e => {
    setBtnTab(e.currentTarget.value);
    setBtnMenuMobile(!btnMenuMobile);
  };

  const handleMenu = () => {
    setBtnMenu(!btnMenu);
    console.log('menu');
  };

  const handleMenuMobile = () => {
    setBtnMenuMobile(!btnMenuMobile);
    console.log('handleMenuMobile');
  };

  useEffect(() => {
    setClassListMenuMobile(
      `${
        btnMenuMobile
          ? 'mobile-menu__list--on mobile-menu__list'
          : 'mobile-menu__list'
      }`
    );
  }, [btnMenuMobile]);

  useEffect(() => {
    setClassBtn_menu(`${btnMenu ? 'menu_on' : ''}`);
    setContent_menuOpen(`${btnMenu ? 'content--menuOpen' : ''}`);
  }, [btnMenu]);

  useEffect(() => setAudio(new Audio()), []);

  useEffect(() => {
    setClassBtn_0(btnTab === '0' ? 'activ' : '');
    setClassBtn_1(btnTab === '1' ? 'activ' : '');
    setClassBtn_2(btnTab === '2' ? 'activ' : '');
    setClassBtn_3(btnTab === '3' ? 'activ' : '');
  }, [btnTab]);

  // * Theme -----------------------------------
  // eslint-disable-next-line no-unused-vars
  const { theme, setTheme } = useTheme();

  const THEME = useSelector(state => state.storeData.theme);

  useEffect(() => {
    setTheme(THEME);
  }, [THEME, setTheme]);

  // *  ----------------------------------------

  return (
    <div className="app">
      <Media
        queries={{
          small: '(max-width: 599px)',
          medium: '(min-width: 600px) and (max-width: 1199px)',
          large: '(min-width: 1200px)',
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
            {matches.medium && (
              <div className={`sidebar ${classBtn_menu}`}>
                <div className="menu-btn">
                  <IconButton className="navigation-btn" onClick={handleMenu}>
                    <DensityMediumIcon className="btn-ico"></DensityMediumIcon>
                  </IconButton>

                  <RadioMini
                    className="navigation-btn"
                    onAudio={audio}
                  ></RadioMini>

                  <IconButton
                    className={`navigation-btn ${classBtn_0}`}
                    type="button"
                    value="0"
                    onClick={handleBtnTab}
                  >
                    <HomeIcon className="btn-ico" />
                  </IconButton>

                  <IconButton
                    className={`navigation-btn ${classBtn_1}`}
                    type="button"
                    value="1"
                    onClick={handleBtnTab}
                  >
                    <AccountBalanceIcon className="btn-ico" />
                  </IconButton>

                  <IconButton
                    className={`navigation-btn ${classBtn_2}`}
                    type="button"
                    value="2"
                    onClick={handleBtnTab}
                  >
                    <ThunderstormIcon className="btn-ico" />
                  </IconButton>

                  <IconButton
                    className={`navigation-btn ${classBtn_3}`}
                    type="button"
                    value="3"
                    onClick={handleBtnTab}
                  >
                    <InfoIcon className="btn-ico" />
                  </IconButton>
                </div>
                <div className="menu-open">
                  <div>
                    <p className="menu-open-text">Меню</p>
                    <p className="menu-open-text">
                      {radioStationName[PLAYER_STATION]}
                    </p>
                    <p className={`menu-open-text ${classBtn_0}`}>Главная</p>
                    <p className={`menu-open-text ${classBtn_1}`}>Курс валют</p>
                    <p className={`menu-open-text ${classBtn_2}`}>Погода</p>
                    <p className={`menu-open-text ${classBtn_3}`}>Инфо</p>
                  </div>
                </div>
              </div>
            )}
            {matches.large && (
              <div className={`sidebar ${classBtn_menu}`}>
                <div className="menu-btn">
                  <IconButton className="navigation-btn" onClick={handleMenu}>
                    <DensityMediumIcon className="btn-ico"></DensityMediumIcon>
                  </IconButton>

                  <RadioMini
                    className="navigation-btn"
                    onAudio={audio}
                  ></RadioMini>

                  <IconButton
                    className={`navigation-btn ${classBtn_0}`}
                    type="button"
                    value="0"
                    onClick={handleBtnTab}
                  >
                    <HomeIcon className="btn-ico" />
                  </IconButton>

                  <IconButton
                    className={`navigation-btn ${classBtn_1}`}
                    type="button"
                    value="1"
                    onClick={handleBtnTab}
                  >
                    <AccountBalanceIcon className="btn-ico" />
                  </IconButton>

                  <IconButton
                    className={`navigation-btn ${classBtn_2}`}
                    type="button"
                    value="2"
                    onClick={handleBtnTab}
                  >
                    <ThunderstormIcon className="btn-ico" />
                  </IconButton>

                  <IconButton
                    className={`navigation-btn ${classBtn_3}`}
                    type="button"
                    value="3"
                    onClick={handleBtnTab}
                  >
                    <InfoIcon className="btn-ico" />
                  </IconButton>
                </div>
                <div className="menu-open">
                  <div>
                    <p className="menu-open-text">Меню</p>
                    <p className="menu-open-text">
                      {radioStationName[PLAYER_STATION]}
                    </p>
                    <p className={`menu-open-text ${classBtn_0}`}>Главная</p>
                    <p className={`menu-open-text ${classBtn_1}`}>Курс валют</p>
                    <p className={`menu-open-text ${classBtn_2}`}>Погода</p>
                    <p className={`menu-open-text ${classBtn_3}`}>Инфо</p>
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </Media>

      <div className={`content ${content_menuOpen}`}>
        {btnTab === '0' && <Main onAudio={audio}></Main>}
        {btnTab === '1' && <CurrencyIndex></CurrencyIndex>}
        {btnTab === '2' && <Weather></Weather>}
        {btnTab === '3' && <Info></Info>}
      </div>
    </div>
  );
};

console.log(info, 'font-family:monospace;color:#1976d2;font-size:12px;');
