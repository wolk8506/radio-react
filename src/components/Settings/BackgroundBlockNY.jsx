import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeChengeWalpaper } from 'store/root/actions';
import { getThemeChengeWalpaper } from 'store/root/selectors';

import { ThemeChangeBackgroundNewYear1 } from './ThemeChangeBackgroundNewYear1';
import { ThemeChangeBackgroundNewYear2 } from './ThemeChangeBackgroundNewYear2';

export const BackgroundBlockNY = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(getThemeChengeWalpaper);
  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleChange = e => {
    dispatch(setThemeChengeWalpaper(e.target.value));
    setValue(e.target.value);
  };

  return (
    <>
      <div className="settings">
        <ThemeChangeBackgroundNewYear1 value={value} onHandleChange={handleChange} />
      </div>
      <div className="settings">
        <ThemeChangeBackgroundNewYear2 value={value} onHandleChange={handleChange} />
      </div>
    </>
  );
};
