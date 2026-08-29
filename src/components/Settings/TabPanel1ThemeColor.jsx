import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import CheckIcon from '@mui/icons-material/Check';

export const TabPanel1ThemeColor = () => {
  const dispatch = useDispatch();
  const THEME = useSelector(rootSelectors.getThemeChengeTheme);

  const [value, setValue] = useState(THEME);

  const handleChange = key => {
    dispatch(dataActions.setThemeChengeTheme(key));
    setValue(key);
  };

  const theme_color = [
    { key: 'dark-eclipse', name: 'Темное затмение' },
    { key: 'obsidian-flame', name: 'Обсидиановое пламя' },
    { key: 'midnight-bloom', name: 'Полуночное цветение' },
    { key: 'muted-earth', name: 'Приглушенная Земля' },
    { key: 'muted-moon', name: 'Приглушенная Луна' },
    { key: 'velvet-ember', name: 'Бархатный уголек' },
    { key: 'shadow-ember', name: 'Тень Эмбер' },
    { key: 'twilight-violet', name: 'Сумеречная фиалка' },
  ];

  return (
    <div className="mac-list">
      <div className="mac-list__title">Изменение темы</div>
      {theme_color.map(i => (
        <div
          key={i.key}
          className={`mac-row${value === i.key ? ' mac-row--selected' : ''}`}
          onClick={() => handleChange(i.key)}
          role="radio"
          aria-checked={value === i.key}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleChange(i.key);
            }
          }}
        >
          <span className="mac-row__check">{value === i.key && <CheckIcon />}</span>
          <span className="mac-row__name">{i.name}</span>
          <span className={`theme__color theme__color--scheme-${i.key}`}>
            {Array.from({ length: 10 }).map((_, idx) => (
              <span className="color__item" key={idx} />
            ))}
          </span>
        </div>
      ))}
    </div>
  );
};
