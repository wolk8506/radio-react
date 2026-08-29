import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { authOperations } from 'store';
import { BASE_URL } from '../config';

import { Button, TextField } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case 'email':
        return setEmail(value);
      case 'password':
        return setPassword(value);
      default:
        return;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await dispatch(authOperations.logIn({ email, password })).unwrap();
      // Синхронизируем пользователя из бэкенда (как при перезагрузке),
      // чтобы isLoggedIn/user были актуальны без перезагрузки страницы.
      dispatch(authOperations.fetchCurrentUser());
    } catch {
      // ошибка уже показана в operations
    } finally {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="container-login">
      <nav className="navigation">
        <div className="navigation__page-name">
          <span className="page-name__name">Страница входа</span>
        </div>

        <div>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'activeLink' : 'link')}>
            Регистрация
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'activeLink' : 'link')}>
            Вход
          </NavLink>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="form" autoComplete="off">
        <TextField
          fullWidth
          sx={{ width: '320' }}
          label="Почта"
          variant="standard"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          color="success"
        />

        <FormControl color="success" sx={{ width: '320' }} variant="standard">
          <InputLabel htmlFor="password">Пароль</InputLabel>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button fullWidth type="submit" variant="contained" color="success">
          Вход
        </Button>

        <Button
          fullWidth
          type="button"
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={() => {
            const redirect = `${window.location.origin}/radio-react/auth/google/callback`;
            window.location.href = `${BASE_URL}/auth/google?redirect=${encodeURIComponent(redirect)}`;
          }}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          Войти через Google
        </Button>
      </form>
    </div>
  );
};
