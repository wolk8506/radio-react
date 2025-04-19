import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getPlayerPlay, getPlayerStation } from 'store/root/selectors';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

import equalizer from '../../images/equalizer.webp';
import equalizer_off from '../../images/equalizer-off.png';
import { radioData } from './Radio-data';

export const RadioMini = ({ onAudio, open }) => {
  const PLAYER_STATION = useSelector(getPlayerStation);
  const PLAYER_PLAY = useSelector(getPlayerPlay);

  const [station, setStation] = useState(PLAYER_STATION);
  const [playPause, setPlayPause] = useState(PLAYER_PLAY);
  const [pauseEvent, setPauseEvent] = useState(true);

  useEffect(() => {
    setStation(PLAYER_STATION);
  }, [PLAYER_PLAY, PLAYER_STATION]);

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
        setPauseEvent(onAudio.paused);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [onAudio, pauseEvent]);

  function onPlay() {
    if (playPause) {
      play();
    } else {
      onAudio.pause();
    }
  }

  function play() {
    onAudio.src = radioData[station].url;
    onAudio.play();
  }

  return (
    <>
      <ListItem onClick={onPlay} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={[
            {
              minHeight: 48,
              px: 2.5,
            },
            open
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
              open
                ? {
                    mr: 3,
                  }
                : {
                    mr: 'auto',
                  },
            ]}
          >
            {playPause ? <PlayArrowIcon className="btn-ico" /> : <PauseIcon className="btn-ico" />}
          </ListItemIcon>
          <ListItemText
            primary={
              PLAYER_PLAY ? (
                <div className="radio-station-name">
                  <img src={equalizer_off} alt="equalizer" />
                  <span>{radioData[PLAYER_STATION].name}</span>
                </div>
              ) : (
                <div className="radio-station-name">
                  <img src={equalizer} alt="equalizer" />
                  <span>{radioData[PLAYER_STATION].name}</span>
                </div>
              )
            }
            sx={[
              open
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
    </>
  );
};
