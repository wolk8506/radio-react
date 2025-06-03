import { useLayoutEffect, useState } from 'react';

export const useBackground = () => {
  const [themeBackground, setThemeBackground] = useState('color');

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-background', themeBackground);
  }, [themeBackground]);

  return { themeBackground, setThemeBackground };
};
