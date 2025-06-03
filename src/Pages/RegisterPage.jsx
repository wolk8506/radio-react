import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import { authOperations } from 'store';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [resendEmail, setResendEmail] = useState();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case 'name':
        return setName(value);
      case 'email':
        return setEmail(value);
      case 'password':
        return setPassword(value);
      case 'confirmPassword':
        return setConfirmPassword(value);
      // case 'resendEmail':
      //   return setResendEmail(value);
      default:
        return;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (password.length < 6) {
      toast.warn('Пароль не должен быть короче 6 символов');
      setPassword('');
      setConfirmPassword('');
      return;
    }
    if (password !== confirmPassword) {
      toast.warn('Пароли не совпадают, пожалуйста, введите пароль еще раз');
      setPassword('');
      setConfirmPassword('');
      return;
    }
    dispatch(authOperations.register({ name, email, password }));
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const OnSumbit = e => {
    // e.preventDefault();
    // dispatch(authOperations.verifyEmail({ email: resendEmail }));
    // setOpen(false);
    // setResendEmail('');
  };

  return (
    <div className="container-register">
      <nav className="navigation">
        <div className="navigation__page-name">
          <span className="page-name__name">Страница регистрации</span>
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
          label="Имя"
          variant="standard"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          color="success"
        />

        <TextField
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

        <FormControl color="success" sx={{ width: '320' }} variant="standard">
          <InputLabel htmlFor="confirmPassword">Подтвердите пароль</InputLabel>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
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
          Регистрация
        </Button>
      </form>
      <button className="btn-form-resend" onClick={handleOpen}>
        Я не получил письмо с подтверждением
      </button>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Чтобы повторно отправить проверочное письмо, введите адрес электронной почты, указанный при регистрации.
            </Typography>
            <div className="block-resend">
              <TextField
                id="resendEmail"
                label="Почта"
                variant="standard"
                type="email"
                name="resendEmail"
                onChange={handleChange}
              />

              <Button onClick={OnSumbit}>отправить письмо</Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};
