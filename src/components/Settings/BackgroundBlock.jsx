import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setThemeChengeWalpaper } from 'store/root/actions';
import { getThemeChengeWalpaper } from 'store/root/selectors';

import { ThemeBackgroundImg } from './ThemeBackgroundImg';
import { ThemeBackgroundColor } from './ThemeBackgroundColor';
import { AddBackgroundImg } from './AddBackgroundImg';

export const BackgroundBlock = () => {
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
        <ThemeBackgroundColor value={value} onHandleChange={handleChange} />
      </div>
      <div className="settings">
        <ThemeBackgroundImg value={value} onHandleChange={handleChange} />
      </div>
      <div className="settings">
        <AddBackgroundImg value={value} onHandleChange={handleChange} />
      </div>
    </>
  );
};
