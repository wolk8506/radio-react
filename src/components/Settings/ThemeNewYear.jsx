import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setThemeNewYear } from 'store/root/actions';
import { getThemeNewYear } from 'store/root/selectors';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useEffect } from 'react';

export const ThemeNewYear = () => {
  const dispatch = useDispatch();
  const THEME_NEW_YEAR = useSelector(getThemeNewYear);
  const [state, setState] = React.useState(THEME_NEW_YEAR);

  useEffect(() => {
    dispatch(setThemeNewYear(state));
  }, [dispatch, state]);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });

    if (event.target.name === 'sugrob') {
      if (!event.target.checked) {
        setState({
          sugrob: false,
          blueWhiteIgloo: false,
          snowMan: false,
          christmasTree: false,
          pole: false,
          santaSleigh: false,
          year: false,
          snake: false,
        });
      }
    }
  };

  return (
    <FormControl className="form-auto-chenge-theme">
      <FormLabel id="controlled-radio-widget">Новый год</FormLabel>
      <Divider color />
      <Divider color />
      <Divider color />
      <FormLabel id="controlled-radio-widget">Падающий снег</FormLabel>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>выкл</Typography>
        <Switch defaultChecked checked={state.snow} onChange={handleChange} name="snow" />
        <Typography>вкл</Typography>
      </Stack>
      <Divider color />
      <Divider color />
      <Divider color />
      <FormLabel id="controlled-radio-widget">Таймер нового года</FormLabel>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>выкл</Typography>
        <Switch defaultChecked checked={state.timer} onChange={handleChange} name="timer" />
        <Typography>вкл</Typography>
      </Stack>
      <Divider color />
      <Divider color />
      <Divider color />

      <FormLabel id="controlled-radio-widget">Снег</FormLabel>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch defaultChecked checked={state.sugrob} onChange={handleChange} name="sugrob" />
        <Typography>Сугроб</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch
          defaultChecked
          checked={state.blueWhiteIgloo}
          onChange={handleChange}
          name="blueWhiteIgloo"
          disabled={!state.sugrob}
        />
        <Typography>Иглу</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch
          defaultChecked
          checked={state.snowMan}
          onChange={handleChange}
          name="snowMan"
          disabled={!state.sugrob}
        />
        <Typography>Снеговик</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch
          defaultChecked
          checked={state.christmasTree}
          onChange={handleChange}
          name="christmasTree"
          disabled={!state.sugrob}
        />
        <Typography>Елка</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch defaultChecked checked={state.pole} onChange={handleChange} name="pole" disabled={!state.sugrob} />
        <Typography>Указатель</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch
          defaultChecked
          checked={state.santaSleigh}
          onChange={handleChange}
          name="santaSleigh"
          disabled={!state.sugrob}
        />
        <Typography>Санта</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch defaultChecked checked={state.year} onChange={handleChange} name="year" disabled={!state.sugrob} />
        <Typography>Год</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Switch defaultChecked checked={state.snake} onChange={handleChange} name="snake" disabled={!state.sugrob} />
        <Typography>Знак года</Typography>
      </Stack>
    </FormControl>
  );
};
