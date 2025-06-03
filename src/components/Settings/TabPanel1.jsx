import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dataActions, rootSelectors } from 'store';

import { TabPanel1ThemeColorAutoChange } from './TabPanel1ThemeColorAutoChange';
import { TabPanel1ThemeColor } from './TabPanel1ThemeColor';
import { TabPanel1ClockWidjet } from './TabPanel1ClockWidjet';
import { TabPanel1WeatherIcon } from './TabPanel1WeatherIcon';
import { TabPanel1BackgroundColor } from './TabPanel1BackgroundColor';
import { TabPanel1Wallpaper } from './TabPanel1Wallpaper';
import { TabPanel1AddWallpaper } from './TabPanel1AddWallpaper';

export const TabPanel1 = () => {
  const dispatch = useDispatch();
  const themeChengeWalpaper = useSelector(rootSelectors.getThemeChengeWalpaper);
  const [value, setValue] = useState(themeChengeWalpaper);

  const handleChange = e => {
    dispatch(dataActions.setThemeChengeWalpaper(e.target.value));
    setValue(e.target.value);
  };

  return (
    <div className="tab-panel">
      <div className="settings">
        <TabPanel1ThemeColorAutoChange />
        <TabPanel1ThemeColor />
      </div>
      <div className="settings settings--height">
        <TabPanel1ClockWidjet />
      </div>
      <div className="settings">
        <TabPanel1WeatherIcon />
      </div>
      <div className="settings">
        <TabPanel1BackgroundColor value={value} onHandleChange={handleChange} />
      </div>
      <div className="settings">
        <TabPanel1Wallpaper value={value} onHandleChange={handleChange} />
      </div>
      <div className="settings">
        <TabPanel1AddWallpaper value={value} onHandleChange={handleChange} />
      </div>
    </div>
  );
};
