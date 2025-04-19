import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logIn } from '../store/auth/operations';

import { Button, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const LoginView = () => {
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

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(logIn({ email, password }));
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container-login">
      <nav className="navigation">
        <div className="navigation__page-name">
          <span className="page-name__name">Login page</span>
        </div>

        <div>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'activeLink' : 'link')}>
            Registration
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'activeLink' : 'link')}>
            Login
          </NavLink>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="form" autoComplete="off">
        <TextField
          label="Email"
          variant="standard"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          color="success"
        />

        <FormControl color="success" sx={{ width: '320' }} variant="standard">
          <InputLabel htmlFor="password">Password</InputLabel>
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

        <Button type="submit" variant="outlined" color="success">
          Login
        </Button>
      </form>
    </div>
  );
};
