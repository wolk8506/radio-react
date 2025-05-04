import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeAutoChengeTheme } from 'store/root/actions';
import { getThemeAutoChengeTheme } from 'store/root/selectors';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';

export const ThemeChangeAuto = () => {
  const dispatch = useDispatch();

  const THEME_AUTO_CHANGE = useSelector(getThemeAutoChengeTheme);
  const [value, setValue] = useState(THEME_AUTO_CHANGE);

  const handleChange = e => {
    dispatch(setThemeAutoChengeTheme(e.target.checked));
    setValue(e.target.checked);
  };
  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Автоизменение темы</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={value} onChange={handleChange} name="gilad" />}
          label={value ? 'выключить' : 'включить'}
        />
      </FormGroup>
    </FormControl>
  );
};
