import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export const TabPanel1ThemeColor = () => {
  const dispatch = useDispatch();
  const THEME = useSelector(rootSelectors.getThemeChengeTheme);

  const [value, setValue] = useState(THEME);

  const handleChange = e => {
    dispatch(dataActions.setThemeChengeTheme(e.target.value));
    setValue(e.target.value);
  };

  const theme_color = [
    { key: 'dark-eclipse', name: 'Темное затмение' },
    { key: 'obsidian-flame', name: 'Обсидиановое пламя' },
    { key: 'midnight-bloom', name: 'Полуночное цветение' },
    { key: 'muted-earth', name: 'Приглушенная Земля' },
    { key: 'velvet-ember', name: 'Бархатный уголек' },
    { key: 'shadow-ember', name: 'Тень Эмбер' },
    { key: 'twilight-violet', name: 'Сумеречная фиалка' },
  ];

  return (
    <FormControl>
      <FormLabel id="controlled-radio-theme">Изменение темы</FormLabel>
      <RadioGroup aria-labelledby="controlled-radio-theme" name="radio-theme" value={value} onChange={handleChange}>
        {theme_color.map((i, index) => {
          return (
            <div className="item-theme" key={i.key}>
              <FormControlLabel className="btn" value={i.key} control={<Radio />} label={i.name} />
              <div className={`theme__color theme__color--scheme-${i.key}`}>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
                <div className="color__item"></div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};
