import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playerStation, playerPlay } from 'store/actions';
// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Slider from '@mui/material/Slider';
// import VolumeDown from '@mui/icons-material/VolumeDown';
// import VolumeUp from '@mui/icons-material/VolumeUp';
// import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CardMedia from '@mui/material/CardMedia';

import img_181_fm from '../../images/station/img-181.fm.jpg';
import img_kiss_fm from '../../images/station/img-kiss-fm.jpg';
import img_nrg_radio from '../../images/station/img-nrg-radio.jpg';
import img_soundpark_deep from '../../images/station/img-soundpark-deep.jpg';

export const Radio = ({ onAudio }) => {
  const logo = [img_181_fm, img_soundpark_deep, img_nrg_radio, img_kiss_fm];

  const PLAYER_STATION = useSelector(state => state.storeData.playerStation);
  const dispatch = useDispatch();
  const [station, setStation] = useState(PLAYER_STATION);
  const [playPause, setPlayPause] = useState(true);
  const [playTime, setPlayTime] = useState(0);
  const [pauseEvent, setPauseEvent] = useState(true);
  const radioStation = [
    'https://listen.181fm.com/181-rock_128k.mp3',
    'https://getradio.me/spdeep',
    'https://pub0202.101.ru:8443/stream/air/aac/64/99',
    'https://link.smmbox.ru/http://online.kissfm.ua/KissFM_HD',
  ];

  function handlePlayPause() {
    setPlayPause(!playPause);
    if (playPause) {
      play();
    } else {
      onAudio.pause();
    }
  }

  useEffect(() => {
    dispatch(playerPlay(playPause));
  });

  const handleStahion = e => {
    changeStation(e.target.value);
    setStation(e.target.value);
    dispatch(playerStation(e.target.value));
  };

  function changeStation(value) {
    setPlayPause(true);
    onAudio.pause();
    onAudio.src = radioStation[value];
    onAudio.play();
    setPlayPause(false);
  }

  function play() {
    onAudio.src = radioStation[station];
    onAudio.play();
  }

  useEffect(() => {
    if (!pauseEvent) {
      setPlayPause(false);
    }
    if (pauseEvent) {
      setPlayPause(true);
    }
  }, [pauseEvent]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (onAudio) {
        var s = parseInt(onAudio.currentTime % 60);
        var m = parseInt((onAudio.currentTime / 60) % 60);
        setPlayTime(`${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`);
        setPauseEvent(onAudio.paused);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [onAudio, pauseEvent]);

  return (
    <div className="maim-player">
      <CardMedia
        className="logoRadio"
        component="img"
        sx={{ width: 128 }}
        image={logo[station]}
        alt="Live from space album cover"
      />
      <div>
        <div className="maim-player__clock-block">
          <p className="clock-block__clock">{playTime}</p>
        </div>

        <FormControl className="selectRadioStation">
          <Select className="list" value={station} onChange={handleStahion}>
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

      <figure
        className={playPause ? 'toggle' : 'toggle_on'}
        onClick={handlePlayPause}
      >
        <div className="btn_play">
          {playPause ? (
            <PlayArrowIcon sx={{ fontSize: 40 }} />
          ) : (
            <PauseIcon sx={{ fontSize: 40 }} />
          )}
        </div>
      </figure>
    </div>
  );
};
