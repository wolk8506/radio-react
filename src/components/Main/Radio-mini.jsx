import * as React from 'react';

// import img_181_fm from '../../images/station/img-181.fm.jpg';
// import img_kiss_fm from '../../images/station/img-kiss-fm.jpg';
// import img_nrg_radio from '../../images/station/img-nrg-radio.jpg';
// import img_soundpark_deep from '../../images/station/img-soundpark-deep.jpg';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

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
    <div>
      <button
        className={`navigation-btn ${playPause ? 'toggle' : 'toggle_on'}`}
        onClick={onPlay}
      >
        {playPause ? (
          <PlayArrowIcon className="btn-ico" />
        ) : (
          <PauseIcon className="btn-ico" />
        )}
      </button>
    </div>
  );
};
