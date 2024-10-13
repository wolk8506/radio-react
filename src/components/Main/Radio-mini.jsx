import * as React from 'react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import IconButton from '@mui/material/IconButton';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const RadioMini = ({ onAudio }) => {
  const PLAYER_STATION = useSelector(state => state.storeData.playerStation);
  const PLAYER_PLAY = useSelector(state => state.storeData.playerPlay);
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
  const [station, setStation] = useState(PLAYER_STATION);
  const [playPause, setPlayPause] = useState(PLAYER_PLAY);
  const [pauseEvent, setPauseEvent] = useState(true);

  useEffect(() => {
    setStation(PLAYER_STATION);
    // setPlayPause(PLAYER_PLAY);
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
        // var s = parseInt(onAudio.currentTime % 60);
        // var m = parseInt((onAudio.currentTime / 60) % 60);
        // setPlayTime(`${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`);
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
    //  className="navigation-btn"
    <>
      <IconButton
        // className={`navigation-btn ${playPause ? 'toggle' : 'toggle_on'}`}
        className="navigation-btn"
        type="button"
        onClick={onPlay}
      >
        {playPause ? (
          <PlayArrowIcon className="btn-ico" />
        ) : (
          <PauseIcon className="btn-ico" />
        )}
      </IconButton>
    </>
  );
};
