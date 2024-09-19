import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

export const App = () => {
  const PLAYER_STATION = useSelector(state => state.storeData.playerStation);
  const [audio, setAudio] = useState();
  const [btnTab, setBtnTab] = useState('0');
  const [btnMenu, setBtnMenu] = useState(false);
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
  };

  const handleMenu = () => {
    setBtnMenu(!btnMenu);
    console.log('menu');
  };

  useEffect(() => {
    setClassBtn_menu(`${btnMenu ? 'menu_on' : ''}`);
    setContent_menuOpen(`${btnMenu ? 'content--menuOpen' : ''}`);
  }, [btnMenu]);

  useEffect(() => setAudio(new Audio()), []);

  useEffect(() => {
    setClassBtn_0(`navigation-btn ${btnTab === '0' ? 'toggle_on' : 'toggle'}`);
    setClassBtn_1(`navigation-btn ${btnTab === '1' ? 'toggle_on' : 'toggle'}`);
    setClassBtn_2(`navigation-btn ${btnTab === '2' ? 'toggle_on' : 'toggle'}`);
    setClassBtn_3(`navigation-btn ${btnTab === '3' ? 'toggle_on' : 'toggle'}`);
  }, [btnTab]);

  return (
    <div className="app">
      <div className={`sidebar ${classBtn_menu}`}>
        <div className="menu-btn">
          <div className={`sidebar-menu`}>
            <button
              className="toggle btn-menu navigation-btn"
              onClick={handleMenu}
            >
              <DensityMediumIcon className="btn-ico"></DensityMediumIcon>
            </button>
          </div>
          <div className="sidebar-player">
            <RadioMini onAudio={audio}></RadioMini>
          </div>

          <div className="navigation">
            <div className={classBtn_0}>
              <button type="button" value="0" onClick={handleBtnTab}>
                <HomeIcon className="btn-ico" />
              </button>
            </div>
            <div className={classBtn_1}>
              <button type="button" value="1" onClick={handleBtnTab}>
                <AccountBalanceIcon className="btn-ico" />
              </button>
            </div>
            <div className={classBtn_2}>
              <button type="button" value="2" onClick={handleBtnTab}>
                <ThunderstormIcon className="btn-ico" />
              </button>
            </div>
            <div className={classBtn_3}>
              <button type="button" value="3" onClick={handleBtnTab}>
                <InfoIcon className="btn-ico" />
              </button>
            </div>
          </div>
        </div>
        <div className="menu-open">
          <div>
            <div>
              <p className="menu-open-text">Меню</p>
            </div>
            <div>
              <p className="menu-open-text">
                {radioStationName[PLAYER_STATION]}
              </p>
            </div>
            <div>
              <p className="menu-open-text">Главная</p>
            </div>
            <div>
              <p className="menu-open-text">Курс валют</p>
            </div>
            <div>
              <p className="menu-open-text">Погода</p>
            </div>
            <div>
              <p className="menu-open-text">Инфо</p>
            </div>
          </div>
        </div>
      </div>

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
