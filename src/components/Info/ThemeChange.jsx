import * as React from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from 'store/actions';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const ThemeChange = () => {
  const dispatch = useDispatch();
  const THEME = useSelector(state => state.storeData.theme);

  const [value, setValue] = useState(THEME);

  const handleChange = e => {
    dispatch(changeTheme(e.target.value));
    setValue(e.target.value);
    console.log('1', e.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="controlled-radio-theme">Изменение темы</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-theme"
        name="radio-theme"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="dark" control={<Radio />} label="Темная" />
        <FormControlLabel value="dark-2" control={<Radio />} label="Темная 2" />
        <FormControlLabel value="light" control={<Radio />} label="Светлая" />
      </RadioGroup>
    </FormControl>
  );
};