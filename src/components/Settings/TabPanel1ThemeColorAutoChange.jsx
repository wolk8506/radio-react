import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import CustomSwitch from 'components/Elements/CustomSwitch';

export const TabPanel1ThemeColorAutoChange = () => {
  const dispatch = useDispatch();

  const THEME_AUTO_CHANGE = useSelector(rootSelectors.getThemeAutoChengeTheme);
  const [value, setValue] = useState(THEME_AUTO_CHANGE);

  const handleChange = e => {
    dispatch(dataActions.setThemeAutoChengeTheme(e.target.checked));
    setValue(e.target.checked);
  };
  return (
    <div className="theme-auto-row">
      <span className="theme-auto-row__label">Автоизменение темы</span>
      <CustomSwitch checked={value} onChange={handleChange} name="autoTheme" />
    </div>
  );
};
