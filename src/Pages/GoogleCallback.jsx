import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authOperations } from 'store';

import { Button, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export const GoogleCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = params.get('token');
  const status = params.get('status');

  useEffect(() => {
    if (token) {
      dispatch(authOperations.completeGoogleLogin(token))
        .then(() => dispatch(authOperations.fetchCurrentUser()))
        .then(() => navigate('/profile', { replace: true }))
        .catch(() => navigate('/login', { replace: true }));
    } else if (status === 'connected') {
      // Привязка Google к уже авторизованному аккаунту:
      // бэкенд обновил user.googleId, но токен не менялся — синхронизируем user из бэкенда.
      dispatch(authOperations.fetchCurrentUser())
        .then(() => navigate('/profile', { replace: true }));
    }
  }, [token, status, dispatch, navigate]);

  let message;
  if (token) message = 'Вход выполнен, перенаправляем в личный кабинет…';
  else if (status === 'pending')
    message = 'Ваша учётная запись создана и ожидает подтверждения администратором.';
  else if (status === 'email_exists')
    message =
      'Пользователь с такой почтой уже зарегистрирован. Войдите в личный кабинет и привяжите Google, чтобы входить через него.';
  else if (status === 'connected') message = 'Аккаунт Google успешно привязан.';
  else message = 'Не удалось выполнить вход через Google.';

  return (
    <Box
      className="container"
      sx={{
        // maxWidth: 480,
        margin: '10px auto',
        textAlign: 'center',
        padding: 30,
        maxWidth: '1400px',
        height: 'calc(100% - 20px)',
      }}
    >
      <GoogleIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Google авторизация
      </Typography>
      <Typography sx={{ mb: 3 }}>{message}</Typography>
      <Button variant="outlined" component={Link} to="/login">
        На страницу входа
      </Button>
    </Box>
  );
};
