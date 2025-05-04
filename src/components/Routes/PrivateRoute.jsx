import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { authSelectors } from 'store/auth/selectors';

export const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const isFetching = useSelector(authSelectors.getIsFetchingCurrent);
  const location = useLocation(); // Получаем текущий маршрут

  // Пока идет проверка состояния, ничего не рендерим
  if (isFetching) {
    return <div>Loading...</div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу логина с текущим маршрутом
  return isLoggedIn ? children : <Navigate to="/login" state={{ redirectUrl: location.pathname }} replace />;
};
