import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { TabPanel1 } from 'components/Settings/TabPanel1';
import { TabPanel2 } from 'components/Settings/TabPanel2';
import { TabPanel3 } from 'components/Settings/TabPanel3';
import packageJson from '../../package.json';
const version = packageJson.version;

export const SettingsPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <section className="container-settings">
      <div className="header">
        <p className="header__title">settings</p>
        <p className="header__subtitle">radio-react version: {version}</p>
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
            <TabPanel1 />
          </TabPanel>
          <TabPanel value={1}>
            <TabPanel2 />
          </TabPanel>
          <TabPanel value={2}>
            <TabPanel3 />
          </TabPanel>
        </TabContext>
      </Box>
    </section>
  );
};
