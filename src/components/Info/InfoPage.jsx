import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { version } from 'components/info';
import { ThemeChange } from './ThemeChange';
import { ThemeChangeAuto } from './ThemeChangeAuto';
import { ThemeBackgroundImg } from './ThemeBackgroundImg';

import { ThemeRadius } from './ThemeRadius';
import { ThemeNewYear } from './ThemeNewYear';
import { ThemeWeather } from './ThemeWeather';
import { ThemeChangeBackgroundNewYear } from './ThemeChangeBackgroundNewYear';
import { ThemeChangeBackgroundHalloween } from './ThemeChangeBackgroundHalloween';
import { ThemeBackgroundColor } from './ThemeBackgroundColor';

export const Info = () => {
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
                <ThemeChange></ThemeChange>
                <ThemeChangeAuto></ThemeChangeAuto>
              </div>
              <div className="settings">
                <ThemeRadius></ThemeRadius>
              </div>
              <div className="settings">
                <ThemeWeather></ThemeWeather>
              </div>
              <div className="settings">
                <ThemeBackgroundColor></ThemeBackgroundColor>
              </div>
              <div className="settings">
                <ThemeBackgroundImg></ThemeBackgroundImg>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={1}>
            <div className="tab-panel">
              <div className="settings">
                <ThemeNewYear></ThemeNewYear>
              </div>
              <div className="settings">
                <ThemeChangeBackgroundNewYear></ThemeChangeBackgroundNewYear>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={2}>
            <div className="tab-panel">
              <div className="settings">
                <ThemeChangeBackgroundHalloween></ThemeChangeBackgroundHalloween>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </section>
  );
};
