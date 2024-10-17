import { useLayoutEffect, useState } from 'react';

const defaultTheme = 'color';

export const useBackground = () => {
  const [themeBackground, setThemeBackground] = useState(defaultTheme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-background', themeBackground);
  }, [themeBackground]);

  return { themeBackground, setThemeBackground };
};
