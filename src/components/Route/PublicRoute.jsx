import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { authSelectors } from 'store/auth/selectors';
import { useLocation } from 'react-router-dom';

export const PublicRoute = ({ children, restricted }) => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const isFetching = useSelector(authSelectors.getIsFetchingCurrent);
  const location = useLocation();

  const redirectUrl = location.state?.redirectUrl || '/profile'; // Получаем сохранённый роут или главную страницу

  // Пока идёт проверка, ничего не рендерим
  if (isFetching) {
    return null;
  }

  // return isLoggedIn && restricted ? <Navigate to="/profile" replace /> : children;
  return isLoggedIn && restricted ? <Navigate to={redirectUrl} replace /> : children;
};
