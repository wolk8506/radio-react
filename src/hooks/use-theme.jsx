import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from 'store/actions';

const isDarkTheme = window?.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = isDarkTheme ? 'dark' : 'light';

export const useTheme = () => {
  const dispatch = useDispatch();
  const THEME_AUTO_CHANGE = useSelector(
    state => state.storeData.themeAutoChange
  );
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    if (THEME_AUTO_CHANGE === true) dispatch(changeTheme(defaultTheme));
  }, [THEME_AUTO_CHANGE, dispatch]);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};
