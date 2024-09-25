import * as React from 'react';
import { version } from 'components/info';

import { ThemeChange } from './ThemeChange';
import { ThemeChangeAuto } from './ThemeChangeAuto';

export const Info = () => {
  return (
    <section>
      <div className="about">radio {version}</div>
      <div className="settings">
        <ThemeChange></ThemeChange>
        <ThemeChangeAuto></ThemeChangeAuto>
      </div>
    </section>
  );
};
