import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { version } from '../config';
import { ThemeChange } from '../components/Settings/ThemeChange';
import { ThemeChangeAuto } from '../components/Settings/ThemeChangeAuto';

import { ThemeClock } from '../components/Settings/ThemeClock';
import { ThemeNewYear } from '../components/Settings/ThemeNewYear';
import { ThemeWeather } from '../components/Settings/ThemeWeather';
import { ThemeChangeBackgroundHalloween } from '../components/Settings/ThemeChangeBackgroundHalloween';
import { BackgroundBlock } from 'components/Settings/BackgroundBlock';
import { BackgroundBlockNY } from 'components/Settings/BackgroundBlockNY';

export const SettingsPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <section className="container-settings">
      <div className="about">
        <p className="about__title">settings</p>
        <p className="about1">radio-react {version}</p>
      </div>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Главная" value={0} />
              <Tab label="Новый год" value={1} />
              <Tab label="Хэллоуин" value={2} />
            </TabList>
          </Box>
          <TabPanel value={0}>
            <div className="tab-panel">
              <div className="settings">
                <ThemeChangeAuto />
                <ThemeChange />
              </div>
              <div className="settings settings--height">
                <ThemeClock />
              </div>
              <div className="settings">
                <ThemeWeather />
              </div>
              <BackgroundBlock />
            </div>
          </TabPanel>
          <TabPanel value={1}>
            <div className="tab-panel">
              <div className="settings">
                <ThemeNewYear />
              </div>
              <BackgroundBlockNY />
            </div>
          </TabPanel>
          <TabPanel value={2}>
            <div className="tab-panel">
              <div className="settings">
                <ThemeChangeBackgroundHalloween />
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </section>
  );
};
