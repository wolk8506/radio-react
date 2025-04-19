import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

import { setPlayerStation } from 'store/root/actions';
import { getPlayerStation } from 'store/root/selectors';
import { setPlayerPlay } from 'store/root/actions';
import { radioData } from './Radio-data';

export const Radio = ({ onAudio }) => {
  const PLAYER_STATION = useSelector(getPlayerStation);
  const dispatch = useDispatch();
  const [station, setStation] = useState(PLAYER_STATION);
  const [playPause, setPlayPause] = useState(true);
  const [playTime, setPlayTime] = useState(0);
  const [pauseEvent, setPauseEvent] = useState(true);

  function handlePlayPause() {
    setPlayPause(!playPause);
    if (playPause) {
      play();
    } else {
      onAudio.pause();
    }
  }

  useEffect(() => {
    dispatch(setPlayerPlay(playPause));
  });

  const handleStahion = e => {
    changeStation(e.target.value);
    setStation(e.target.value);
    dispatch(setPlayerStation(e.target.value));
  };

  function changeStation(value) {
    setPlayPause(true);
    onAudio.pause();
    onAudio.src = radioData[value].url;
    onAudio.play();
    setPlayPause(false);
  }

  function play() {
    onAudio.src = radioData[station].url;
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
        image={radioData[station].logo}
        alt="Live from space album cover"
      />
      <div>
        <div className="maim-player__clock-block">
          <p className="clock-block__clock">{playTime}</p>
        </div>

        <FormControl className="selectRadioStation">
          <Select className="list" value={station} onChange={handleStahion}>
            {radioData.map((i, index) => {
              return (
                <MenuItem key={index} value={index}>
                  <CardMedia
                    component="img"
                    sx={{ width: 36, marginRight: '8px' }}
                    image={i.logo}
                    alt="Live from space album cover"
                  />
                  {i.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>

      <Button className="btn" variant="outlined" size="large" onClick={handlePlayPause}>
        {playPause ? <PlayArrowIcon className="btn__icon" /> : <PauseIcon className="btn__icon" />}
      </Button>
    </div>
  );
};
