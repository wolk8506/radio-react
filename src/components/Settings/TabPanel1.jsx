import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { rootSelectors, dataActions } from 'store';

import { TabPanel1ThemeColorAutoChange } from './TabPanel1ThemeColorAutoChange';
import { TabPanel1ThemeColor } from './TabPanel1ThemeColor';
import { TabPanel1ClockWidjet } from './TabPanel1ClockWidjet';
import { TabPanel1WeatherIcon } from './TabPanel1WeatherIcon';
import { TabPanel1ClockPreview } from './TabPanel1ClockPreview';

export const TabPanel1 = () => {
  const dispatch = useDispatch();

  const mainClock = useSelector(rootSelectors.getThemeMainClock);
  const [mainClockValue, setMainClockValue] = useState(mainClock);
  const handleMainClockChange = value => {
    dispatch(dataActions.setThemeMainClock(value));
    setMainClockValue(value);
  };

  const mainWeather = useSelector(rootSelectors.getThemeMainWeather);
  const [mainWeatherValue, setMainWeatherValue] = useState(mainWeather);
  const handleMainWeatherChange = value => {
    dispatch(dataActions.setThemeMainWeather(value));
    setMainWeatherValue(value);
  };

  return (
    <>
      <div className="settings-section">
        <div className="tab-panel">
          <div className="settings">
            <div className="preview-title">Тема</div>
            <TabPanel1ThemeColorAutoChange />
            <div className="theme-clock-divider" />
            <TabPanel1ThemeColor />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="tab-panel">
          <div className="settings">
            <div className="preview-title">Часы и погода</div>
            <div className="clock-weather-split">
              <TabPanel1ClockWidjet
                mainClockValue={mainClockValue}
                onMainClockChange={handleMainClockChange}
                mainWeatherValue={mainWeatherValue}
                onMainWeatherChange={handleMainWeatherChange}
              />
              <div className="clock-preview-col">
                <TabPanel1ClockPreview mainClockValue={mainClockValue} mainWeatherValue={mainWeatherValue} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="tab-panel">
          <div className="settings">
            <div className="preview-title">Вид значков погоды</div>
            <TabPanel1WeatherIcon />
          </div>
        </div>
      </div>
    </>
  );
};
