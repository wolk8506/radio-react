import * as React from 'react';

import { TabPanel1 } from 'Pages/Settings/TabPanel1';
import { WallpaperThemes } from 'Pages/Settings/WallpaperThemes';
import { TabPanel2 } from 'Pages/Settings/TabPanel2';
import packageJson from '../../package.json';
const version = packageJson.version;

export const SettingsPage = () => {
  return (
    <section className="container-settings">
      <div className="header">
        <p className="header__title">settings</p>
        <p className="header__subtitle">radio-react version: {version}</p>
      </div>

      <TabPanel1 />
      <div className="settings-section">
        <WallpaperThemes />
      </div>
      <div className="settings-section">
        <TabPanel2 />
      </div>
    </section>
  );
};
