import { TabPanel2Settings } from './TabPanel2Settings';
import { TabPanel2WallpaperNewYear } from './TabPanel2WallpaperNewYear';

export const TabPanel2 = () => {
  return (
    <div className="tab-panel">
      <div className="settings">
        <TabPanel2Settings />
      </div>
      <TabPanel2WallpaperNewYear />
    </div>
  );
};
