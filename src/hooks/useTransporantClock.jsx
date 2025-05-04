import { useLayoutEffect, useState } from 'react';

export const useTransporantClock = () => {
  const [themeTransporantClock, setThemeTransporantClock] = useState(100);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--transparency', `${themeTransporantClock}%`);
  }, [themeTransporantClock]);

  return { themeTransporantClock, setThemeTransporantClock };
};
