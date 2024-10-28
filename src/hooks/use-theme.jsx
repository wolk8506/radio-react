import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { changeTheme } from 'store/actions';
import { setThemeChengeTheme } from 'store/actions';
import { getThemeChengeTheme } from 'store/selectors';

const isDarkTheme = window?.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = isDarkTheme ? 'dark' : 'light';

export const useTheme = () => {
  const dispatch = useDispatch();
  const THEME_AUTO_CHANGE = useSelector(getThemeChengeTheme);
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    if (THEME_AUTO_CHANGE === true) dispatch(setThemeChengeTheme(defaultTheme));
  }, [THEME_AUTO_CHANGE, dispatch]);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};
