import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCurrentUser } from '../../store/auth/operations';
import { getIsLoggedIn } from '../../store/auth/selectors';

import { version } from 'components/info';
import { ThemeChange } from './ThemeChange';
import { ThemeChangeAuto } from './ThemeChangeAuto';
import { ThemeChangeBackground } from './ThemeChangeBackground';
// import { ThemeClock } from './ThemeClock';
import { ThemeRadius } from './ThemeRadius';
import { ThemeNewYear } from './ThemeNewYear';
import { ThemeWeather } from './ThemeWeather';

export const Info = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
    }
    dispatch(fetchCurrentUser());
  }, [dispatch, isLoggedIn]);

  return (
    <section>
      <div className="about">
        <p className="about__title">radio {version}</p>
      </div>
      <div className="block__settings">
        <div className="settings">
          <ThemeChange></ThemeChange>
          <ThemeChangeAuto></ThemeChangeAuto>
        </div>
        <div className="settings">
          <ThemeNewYear></ThemeNewYear>
        </div>
        <div className="settings">
          <ThemeRadius></ThemeRadius>
        </div>
        <div className="settings">
          <ThemeWeather></ThemeWeather>
        </div>
      </div>

      <div className="settings settings--walpaper ">
        <ThemeChangeBackground></ThemeChangeBackground>
      </div>
    </section>
  );
};
