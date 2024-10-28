import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getPlayerPlay, getPlayerStation } from 'store/selectors';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

import equalizer from '../../images/equalizer.webp';
import equalizer_off from '../../images/equalizer-off.png';

export const RadioMini = ({ onAudio, open }) => {
  const PLAYER_STATION = useSelector(getPlayerStation);
  const PLAYER_PLAY = useSelector(getPlayerPlay);
  const radioStation = [
    'https://listen.181fm.com/181-rock_128k.mp3',
    'https://getradio.me/spdeep',
    'https://pub0202.101.ru:8443/stream/air/aac/64/99',
    'https://link.smmbox.ru/http://online.kissfm.ua/KissFM_HD',
    'https://ep256.hostingradio.ru:8052/europaplus256.mp3',
    'https://radio7.hostingradio.ru:8040/radio7256.mp3',
    'https://rock.amgradio.ru/RusRock?r_bells',
    'https://radiorecord.hostingradio.ru/rock96.aacp',
    'https://cast2.my-control-panel.com/proxy/vladas/stream',
    'https://maximum.hostingradio.ru/maximum96.aacp',
    'https://dfm.hostingradio.ru/dfm96.aacp',
    'https://www.liveradio.es/http://online.kissfm.ua/KissFM_Deep_HD',
  ];
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
    onAudio.src = radioStation[station];
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
                  <span>{radioStationName[PLAYER_STATION]}</span>
                </div>
              ) : (
                <div className="radio-station-name">
                  <img src={equalizer} alt="equalizer" />
                  <span>{radioStationName[PLAYER_STATION]}</span>
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
