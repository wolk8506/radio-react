import * as React from 'react';
import { version } from 'components/info';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme, changeThemeAuto } from 'store/actions';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const Info = () => {
  const dispatch = useDispatch();
  const THEME = useSelector(state => state.storeData.theme);
  const THEME_AUTO_CHANGE = useSelector(
    state => state.storeData.themeAutoChange
  );

  const [theme, setTheme] = useState(THEME); //THEME
  const [autoChengeTheme1, setAutoChengeTheme1] = useState(THEME_AUTO_CHANGE); //THEME

  // const handleChangeTheme = ev => {
  //   dispatch(changeTheme(ev.target.value));
  //   setTheme(ev.target.value);
  //   console.log(ev.target.value);
  // };

  // const handleAutoChangeThemeAuto = e => {
  //   dispatch(changeThemeAuto(e.target.value));
  //   setAutoChengeTheme1(e.target.value);
  //   console.log(e.target.value);
  // };

  const handleChangeTheme = e => {
    dispatch(changeTheme(e.target.value));
    setTheme(e.target.value);
    console.log(e.target.value);
  };

  const handleChange = e => {
    dispatch(changeThemeAuto(e.target.value));
    setAutoChengeTheme1(e.target.value);
    console.log(e.target.value);
  };
  return (
    <section>
      <div className="about">radio {version}</div>
      <div>
        <FormLabel id="radio-buttons-theme">Изменить тему</FormLabel>
        <RadioGroup
          aria-labelledby="radio-buttons-theme"
          defaultValue={theme}
          name="radio-buttons-group-1"
          onChange={handleChangeTheme}
        >
          <FormControlLabel value="dark" control={<Radio />} label="Темная" />
          <FormControlLabel value="light" control={<Radio />} label="Светлая" />
        </RadioGroup>
      </div>
      <div>
        <FormLabel id="qwerty">Автоматическое изменение темы</FormLabel>
        <RadioGroup
          aria-labelledby="qwerty"
          defaultValue={autoChengeTheme1}
          name="qwerty-group-2"
          onChange={handleChange}
        >
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="Автоматическое"
          />
          <FormControlLabel value="false" control={<Radio />} label="Ручное" />
        </RadioGroup>
      </div>
    </section>
  );
};
