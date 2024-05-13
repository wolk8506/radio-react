import { CurrencyNBU } from './Currency/CurrencyNBU';
import { CurrencyZVR } from './Currency/CurrencyZVR';
import { Weather } from './Weather/Weather';
import { Currency } from './Currency/Currency';
import { Radio } from './Radio/Radio';
import { useEffect, useState } from 'react';
import { Clock } from './Clock/Clock';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CardMedia from '@mui/material/CardMedia';

import img_181_fm from '../images/station/img-181.fm.jpg';
import img_kiss_fm from '../images/station/img-kiss-fm.jpg';
import img_nrg_radio from '../images/station/img-nrg-radio.jpg';
import img_soundpark_deep from '../images/station/img-soundpark-deep.jpg';
import { CurrencyMono } from './Currency/CurrencyMono';

import {
  getKursTodayBanks,
  getLocation,
  getMonoToday,
  getWeather,
  getZVRCurrent,
  getZVRPrevious,
} from 'store/thunks';
import { WeatherDashboard } from './Weather/WeatherDashboard';
import { useDispatch, useSelector } from 'react-redux';

import { CurrencyBanks } from './Currency/CurrencyBanks';
import { playerStation } from 'store/actions';
// import { Arduino } from './Arduino/Arduino';

export const App = () => {
  const CITY = useSelector(state => state.storeWeatherCity.city);
  const PLAYER_STATION = useSelector(
    state => state.storeWeatherCity.playerStation
  );

  const dispatch = useDispatch();
  // Запрос погоды, если первый раз, то погоду определяет по IP, делеее берет локацию из store
  useEffect(() => {
    const URL_WEATHER = `https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=${CITY}&days=14&lang=ru`;
    if (CITY === null) {
      dispatch(getLocation()); //Определение локации
    } else dispatch(getWeather(URL_WEATHER)); //Запрос на погоду после определения локации и все последующие запросы
  }, [CITY, dispatch]);

  // Запрос курса валют моно банк
  useEffect(() => {
    dispatch(getMonoToday());
    dispatch(getKursTodayBanks());
    dispatch(getZVRPrevious());
    dispatch(getZVRCurrent());
  }, [dispatch]);

  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // !! player -- - - - - - - - - - - - - - - - - - - - -
  const [audio, setAudio] = useState();
  const [volume, setVolume] = useState(80);
  const [station, setStation] = useState(PLAYER_STATION);
  const [playPause, setPlayPause] = useState(true);
  const radioStation = [
    'https://listen.181fm.com/181-rock_128k.mp3',
    'https://getradio.me/spdeep',
    'https://pub0202.101.ru:8443/stream/air/aac/64/99',
    'https://link.smmbox.ru/http://online.kissfm.ua/KissFM_HD',
  ];
  const logo = [img_181_fm, img_soundpark_deep, img_nrg_radio, img_kiss_fm];
  const radioStationName = [
    'Rock 181',
    'SOUNDPARK DEEP',
    'Радио Energy',
    'KissFM_HD',
  ];
  // Создание Audio для запуска радио
  useEffect(() => {
    let audio = new Audio();
    setAudio(audio);
  }, []);

  function handlePlayPause() {
    setPlayPause(!playPause);
    if (playPause) {
      play();
    } else {
      audio.pause();
    }
  }

  const handleVolume = (e, newValue) => {
    setVolume(newValue);
    audio.volume = parseFloat(e.target.value / 100);
  };

  const handleStahion = e => {
    changeStation(e.target.value);
    setStation(e.target.value);
    dispatch(playerStation(e.target.value));
  };

  function changeStation(value, stationName) {
    setPlayPause(true);
    audio.pause();
    audio.src = radioStation[value];
    audio.play();
    setPlayPause(false);
  }

  function play() {
    audio.src = radioStation[station];
    audio.play();
  }

  const [timerS, setTimerS] = useState(0);
  const [playTime, setPlayTime] = useState();

  useEffect(() => {
    if (audio) {
      var s = parseInt(audio.currentTime % 60);
      var m = parseInt((audio.currentTime / 60) % 60);
      setPlayTime(`${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`);
    }
  }, [audio, playTime, timerS]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerS(timerS + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerS]);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // !! --------------------------------------------------

  return (
    <div className="container">
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Главная" value="1" />
              <Tab label="Курс валют" value="2" />
              <Tab label="Погода" value="3" />
              {/* <Tab label="Arduino" value="4" /> */}
            </TabList>
            <div className="player">
              <CardMedia
                component="img"
                sx={{ width: 48 }}
                image={logo[station]}
                alt="Live from space album cover"
              />
              <p>{radioStationName[station]}</p>
              <Stack alignItems="center">
                <IconButton
                  size="large"
                  onClick={handlePlayPause}
                  sx={{ color: '#ffffff' }}
                >
                  {playPause ? (
                    <PlayArrowIcon sx={{ fontSize: 40 }} />
                  ) : (
                    <PauseIcon sx={{ fontSize: 40 }} />
                  )}
                </IconButton>
              </Stack>
            </div>
          </Box>
          <TabPanel value="1" className="tab-panel">
            <div className="first-panel">
              <div>
                <Currency></Currency>
              </div>
              <div>
                <WeatherDashboard></WeatherDashboard>
              </div>
              <div>
                <Radio
                  onHandlePlayPause={handlePlayPause}
                  onPlayPause={playPause}
                  onHandleStahion={handleStahion}
                  onStation={station}
                  onHandleVolume={handleVolume}
                  onVolume={volume}
                  onPlayTime={playTime}
                ></Radio>
              </div>
            </div>

            <Clock></Clock>
          </TabPanel>
          <TabPanel value="2" className="tab-panel">
            <CurrencyMono></CurrencyMono>
            <CurrencyBanks></CurrencyBanks>
            <CurrencyNBU></CurrencyNBU>
            <CurrencyZVR></CurrencyZVR>
          </TabPanel>
          <TabPanel value="3">
            <Weather></Weather>
          </TabPanel>
          {/* <TabPanel value="4">
            <Arduino></Arduino>
          </TabPanel> */}
        </TabContext>
      </Box>
    </div>
  );
};

const about = 'version: 0.5';
console.log(
  `%c\n\n\n░██╗░░░░░░░██╗░█████╗░██╗░░░░░██╗░░██╗░█████╗░███████╗░█████╗░░█████╗░\n░██║░░██╗░░██║██╔══██╗██║░░░░░██║░██╔╝██╔══██╗██╔════╝██╔══██╗██╔═══╝░\n░╚██╗████╗██╔╝██║░░██║██║░░░░░█████═╝░╚█████╔╝██████╗░██║░░██║██████╗░\n░░████╔═████║░██║░░██║██║░░░░░██╔═██╗░██╔══██╗╚════██╗██║░░██║██╔══██╗\n░░╚██╔╝░╚██╔╝░╚█████╔╝███████╗██║░╚██╗╚█████╔╝██████╔╝╚█████╔╝╚█████╔╝\n░░░╚═╝░░░╚═╝░░░╚════╝░╚══════╝╚═╝░░╚═╝░╚════╝░╚═════╝░░╚════╝░░╚════╝░\n\n\n${about}`,
  'font-family:monospace;color:#1976d2;font-size:12px;'
);
