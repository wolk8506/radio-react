import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';

export const TabPanel1ThemeColorAutoChange = () => {
  const dispatch = useDispatch();

  const THEME_AUTO_CHANGE = useSelector(rootSelectors.getThemeAutoChengeTheme);
  const [value, setValue] = useState(THEME_AUTO_CHANGE);

  const handleChange = e => {
    dispatch(dataActions.setThemeAutoChengeTheme(e.target.checked));
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
