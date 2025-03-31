import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setPlayerStation } from 'store/actions';
import { getPlayerStation } from 'store/selectors';
import { setPlayerPlay } from 'store/actions';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

import img_181_fm from '../../images/station/img-181.fm.jpg';
// import img_kiss_fm from '../../images/station/kissfm.webp';
import img_nrg_radio from '../../images/station/img-nrg-radio.jpg';
import img_soundpark_deep from '../../images/station/img-soundpark-deep.jpg';
import img_europa_plus from '../../images/station/europaplus.webp';
import img_radio_7 from '../../images/station/radio7.webp';
import img_makradiorusrock from '../../images/station/makradiorusrock.webp';
import img_recordrock from '../../images/station/recordrock.webp';
import img_rockradio from '../../images/station/rockradio.webp';
import img_maximum from '../../images/station/maximum.webp';
import img_dfm from '../../images/station/dfm.webp';
import img_kissfmdeep from '../../images/station/kissfmdeep.webp';

export const Radio = ({ onAudio }) => {
  const logo = [
    img_181_fm,
    img_soundpark_deep,
    img_soundpark_deep,
    img_soundpark_deep,
    img_soundpark_deep,
    img_nrg_radio,
    // img_kiss_fm,
    img_europa_plus,
    img_radio_7,
    img_radio_7,
    img_radio_7,
    img_radio_7,
    img_makradiorusrock,
    img_recordrock,
    img_rockradio,
    img_maximum,
    img_dfm,
    img_kissfmdeep,
  ];
  const PLAYER_STATION = useSelector(getPlayerStation);
  // console.log(PLAYER_STATION2);
  // const PLAYER_STATION = useSelector(state => state.storeData.playerStation);
  const dispatch = useDispatch();
  const [station, setStation] = useState(PLAYER_STATION);
  const [playPause, setPlayPause] = useState(true);
  const [playTime, setPlayTime] = useState(0);
  const [pauseEvent, setPauseEvent] = useState(true);
  const radioStation = [
    'https://listen.181fm.com/181-rock_128k.mp3',
    'https://getradio.me/spdeep',
    'https://stream05.pcradio.ru/sp_deep-hi', //https://pcradio.ru/radio/soundpark-deep
    'https://stream.pcradio.ru/sp_deep-med', //https://pcradio.ru/radio/soundpark-deep
    'https://stream05.pcradio.ru/sp_deep-low', //https://pcradio.ru/radio/soundpark-deep
    'https://pub0202.101.ru:8443/stream/air/aac/64/99',
    // 'https://link.smmbox.ru/http://online.kissfm.ua/KissFM_HD',
    'https://ep256.hostingradio.ru:8052/europaplus256.mp3',
    'https://radio7.hostingradio.ru:8040/radio7256.mp3',
    'https://stream05.pcradio.ru/radio7_ru-hi', //https://pcradio.ru/radio/radio-7-0
    'https://stream05.pcradio.ru/radio7_ru-med', //https://pcradio.ru/radio/radio-7-0
    'https://stream.pcradio.ru/radio7_ru-low', //https://pcradio.ru/radio/radio-7-0
    'https://rock.amgradio.ru/RusRock?r_bells',
    'https://radiorecord.hostingradio.ru/rock96.aacp',
    'https://cast2.my-control-panel.com/proxy/vladas/stream',
    'https://maximum.hostingradio.ru/maximum96.aacp',
    'https://dfm.hostingradio.ru/dfm96.aacp',
    'https://www.liveradio.es/http://online.kissfm.ua/KissFM_Deep_HD',
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
    dispatch(setPlayerPlay(playPause));
  });

  const handleStahion = e => {
    changeStation(e.target.value);
    setStation(e.target.value);
    // dispatch(playerStation(e.target.value));
    dispatch(setPlayerStation(e.target.value));
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
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[0]}
                alt="Live from space album cover"
              />
              Rock 181
            </MenuItem>
            <MenuItem value={1}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[1]}
                alt="Live from space album cover"
              />
              SOUNDPARK DEEP
            </MenuItem>
            <MenuItem value={2}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[2]}
                alt="Live from space album cover"
              />
              SOUNDPARK DEEP (hi)
            </MenuItem>
            <MenuItem value={3}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[3]}
                alt="Live from space album cover"
              />
              SOUNDPARK DEEP (med)
            </MenuItem>
            <MenuItem value={4}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[4]}
                alt="Live from space album cover"
              />
              SOUNDPARK DEEP (low)
            </MenuItem>
            <MenuItem value={5}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[5]}
                alt="Live from space album cover"
              />
              Радио Energy
            </MenuItem>
            {/* <MenuItem value={3}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[3]}
                alt="Live from space album cover"
              />
              KissFM_HD
            </MenuItem> */}
            <MenuItem value={6}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[6]}
                alt="Live from space album cover"
              />
              Europa Plus
            </MenuItem>
            <MenuItem value={7}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[7]}
                alt="Live from space album cover"
              />
              Радио 7
            </MenuItem>
            <MenuItem value={8}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[8]}
                alt="Live from space album cover"
              />
              Радио 7 (hi)
            </MenuItem>
            <MenuItem value={9}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[9]}
                alt="Live from space album cover"
              />
              Радио 7 (med)
            </MenuItem>
            <MenuItem value={10}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[10]}
                alt="Live from space album cover"
              />
              Радио 7 (low)
            </MenuItem>
            <MenuItem value={11}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[11]}
                alt="Live from space album cover"
              />
              Русский Рок
            </MenuItem>
            <MenuItem value={12}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[12]}
                alt="Live from space album cover"
              />
              Record Rock
            </MenuItem>
            <MenuItem value={13}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[13]}
                alt="Live from space album cover"
              />
              Rock Radio
            </MenuItem>
            <MenuItem value={14}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[14]}
                alt="Live from space album cover"
              />
              Радио Максимум
            </MenuItem>
            <MenuItem value={15}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[15]}
                alt="Live from space album cover"
              />
              DFM
            </MenuItem>
            <MenuItem value={16}>
              <CardMedia
                component="img"
                sx={{ width: 36, marginRight: '8px' }}
                image={logo[16]}
                alt="Live from space album cover"
              />
              Kiss FM Deep
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <Button className="btn" variant="outlined" size="large" onClick={handlePlayPause}>
        {playPause ? <PlayArrowIcon className="btn__icon" /> : <PauseIcon className="btn__icon" />}
      </Button>
    </div>
  );
};
