import * as React from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeThemeAuto } from 'store/actions';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const ThemeChangeAuto = () => {
  const dispatch = useDispatch();

  const THEME_AUTO_CHANGE = useSelector(state => state.storeData.themeAutoChange);
  const [value, setValue] = useState(THEME_AUTO_CHANGE);

  const handleChange = e => {
    dispatch(changeThemeAuto(e.target.value));
    setValue(e.target.value);
    // console.log(e.target.value);
  };
  return (
    <FormControl>
      <FormLabel id="controlled-radio-theme-auto">Автоизменение темы</FormLabel>
      <RadioGroup
        aria-labelledby="controlled-radio-theme-auto"
        name="radio-theme-auto"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value={true} control={<Radio />} label="Авто" />
        <FormControlLabel value={false} control={<Radio />} label="Ручное" />
      </RadioGroup>
    </FormControl>
  );
};
