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

import img_181_fm from '../../images/station/img-181.fm.jpg';
import img_kiss_fm from '../../images/station/img-kiss-fm.jpg';
import img_nrg_radio from '../../images/station/img-nrg-radio.jpg';
import img_soundpark_deep from '../../images/station/img-soundpark-deep.jpg';
import s from './Radio.module.css';

export const Radio = ({
  onHandlePlayPause,
  onPlayPause,
  onHandleStahion,
  onStation,
  onHandleVolume,
  onVolume,
  onPlayTime,
}) => {
  const logo = [img_181_fm, img_soundpark_deep, img_nrg_radio, img_kiss_fm];

  return (
    <div className={s.player}>
      <p className={s.clock}>{onPlayTime}</p>
      <CardMedia
        className={s.logoRadio}
        component="img"
        sx={{ width: 128 }}
        image={logo[onStation]}
        alt="Live from space album cover"
      />
      <div>
        <Box className={s.volume}>
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <VolumeDown />
            <Slider
              aria-label="Volume"
              value={onVolume}
              onChange={onHandleVolume}
            />
            <VolumeUp />
          </Stack>
        </Box>

        <FormControl className={s.selectRadioStation}>
          <Select value={onStation} onChange={onHandleStahion}>
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
          onClick={onHandlePlayPause}
          sx={{ color: '#fff' }}
        >
          {onPlayPause ? (
            <PlayArrowIcon sx={{ fontSize: 40 }} />
          ) : (
            <PauseIcon sx={{ fontSize: 40 }} />
          )}
        </IconButton>
      </Stack>
    </div>
  );
};
