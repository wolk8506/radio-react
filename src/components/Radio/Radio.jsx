import { useEffect } from 'react';
import { useState } from 'react';
import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CardMedia from '@mui/material/CardMedia';

import img_181_fm from './img-181.fm.jpg';
import img_kiss_fm from './img-kiss-fm.jpg';
import img_nrg_radio from './img-nrg-radio.jpg';
import img_soundpark_deep from './img-soundpark-deep.jpg';
import s from './Radio.module.css';

export const Radio = () => {
  const [audio, setAudio] = useState();
  const [volume, setVolume] = useState(80);
  const [station, setStation] = useState(0);
  const [playPause, setPlayPause] = useState(true);
  const radioStation = [
    'https://listen.181fm.com/181-rock_128k.mp3',
    'https://getradio.me/spdeep',
    'https://pub0202.101.ru:8443/stream/air/aac/64/99',
    'https://link.smmbox.ru/http://online.kissfm.ua/KissFM_HD',
  ];
  const logo = [img_181_fm, img_soundpark_deep, img_nrg_radio, img_kiss_fm];

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
  };

  function changeStation(value) {
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
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
      // console.log('This will run every second!');
      setTimerS(timerS + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerS]);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

  return (
    <div className={s.player}>
      <p className={s.clock}>{playTime}</p>
      <CardMedia
        className={s.logoRadio}
        component="img"
        sx={{ width: 128 }}
        image={logo[station]}
        alt="Live from space album cover"
      />
      <div>
        <Box className={s.volume}>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <VolumeDown />
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={handleVolume}
            />
            <VolumeUp />
          </Stack>
        </Box>

        <FormControl className={s.selectRadioStation}>
          <Select value={station} onChange={handleStahion}>
            <MenuItem value={0}>
              <CardMedia
                component="img"
                sx={{ width: 36 }}
                image={logo[0]}
                alt="Live from space album cover"
              />
              Rock 181
            </MenuItem>
            <MenuItem value={1}>
              <CardMedia
                component="img"
                sx={{ width: 36 }}
                image={logo[1]}
                alt="Live from space album cover"
              />
              SOUNDPARK DEEP
            </MenuItem>
            <MenuItem value={2}>
              <CardMedia
                component="img"
                sx={{ width: 36 }}
                image={logo[2]}
                alt="Live from space album cover"
              />
              Радио Energy
            </MenuItem>
            <MenuItem value={3}>
              <CardMedia
                component="img"
                sx={{ width: 36 }}
                image={logo[3]}
                alt="Live from space album cover"
              />
              KissFM_HD
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <Stack alignItems="center">
        <IconButton
          size="large"
          onClick={handlePlayPause}
          sx={{ color: '#fff' }}
        >
          {playPause ? (
            <PlayArrowIcon sx={{ fontSize: 40 }} />
          ) : (
            <PauseIcon sx={{ fontSize: 40 }} />
          )}
        </IconButton>
      </Stack>
    </div>
  );
};
