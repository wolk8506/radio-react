import * as React from 'react';

import { version } from 'components/info';
import { ThemeChange } from './ThemeChange';
import { ThemeChangeAuto } from './ThemeChangeAuto';
import { ThemeChangeBackground } from './ThemeChangeBackground';

export const Info = () => {
  const { REACT_APP_TEST } = process.env;
  console.log(REACT_APP_TEST);

  return (
    <section>
      <div className="about">
        <p className="about__title">radio {version}</p>
      </div>

      <div className="settings">
        <ThemeChange></ThemeChange>
        <ThemeChangeAuto></ThemeChangeAuto>
      </div>
      <div className="settings settings--walpaper ">
        <ThemeChangeBackground></ThemeChangeBackground>
      </div>
    </section>
  );
};
