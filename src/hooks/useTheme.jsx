import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dataActions, rootSelectors } from 'store';

const isDarkTheme = window?.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = isDarkTheme ? 'shadow-ember' : 'muted-earth';

export const useTheme = () => {
  const dispatch = useDispatch();
  const THEME_AUTO_CHANGE = useSelector(rootSelectors.getThemeAutoChengeTheme);
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    THEME_AUTO_CHANGE && dispatch(dataActions.setThemeChengeTheme(defaultTheme));
  }, [THEME_AUTO_CHANGE, dispatch]);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};
