import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authSelectors, authOperations } from 'store';

import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { toast } from 'react-toastify';

import moment from 'moment';

export const ProfilePersonData = () => {
  const dispatch = useDispatch();
  const createdAt = useSelector(authSelectors.getCreatedAt);

  const name = useSelector(authSelectors.getUsername);
  const email = useSelector(authSelectors.getEmail);

  const isFetchingUpdateName = useSelector(authSelectors.getIsFetchingUpdateName);
  const isFetchingUpdateEmail = useSelector(authSelectors.getIsFetchingUpdateEmail);
  const isFetchingUpdatePassword = useSelector(authSelectors.getIsFetchingUpdatePassword);

  const userId = useSelector(authSelectors.getUserID);
  const [editModeName, setEditModeName] = useState(false);
  const [editModeEmail, setEditModeEmail] = useState(false);
  const [editModePassword, setEditModePassword] = useState(false);
  const [nameChange, setNameChange] = useState(name);
  const [emailChange, setEmailChange] = useState(email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEdit = e => {
    const activElement = e.currentTarget.value;
    activElement === '0' && setEditModeName(true);
    activElement === '1' && setEditModeEmail(true);
    activElement === '2' && setEditModePassword(true);
  };

  const handleClearName = () => {
    setNameChange(name);
    setEditModeName(false);
  };

  const handleClearEmail = () => {
    setEmailChange(email);
    setEditModeEmail(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case 'name':
        return setNameChange(value);
      case 'email':
        return setEmailChange(value);
      case 'password':
        return setPassword(value);
      case 'newPassword':
        return setNewPassword(value);
      case 'confirmPassword':
        return setConfirmPassword(value);
      default:
        return;
    }
  };

  const OnSumbitUserData = e => {
    const activElement = e.currentTarget.value;
    if (activElement === '0') {
      if (nameChange.length < 2) {
        toast.warn('Имя должно содержать минимум 2 символа');
        return;
      }
      if (nameChange.length > 50) {
        toast.warn('Имя должно содержать максимум 50 символов');
        return;
      }
      dispatch(authOperations.updateName({ name: nameChange }));
    }
    if (activElement === '1') {
      const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      function isEmailValid(email) {
        return EMAIL_REGEXP.test(email);
      }

      if (!isEmailValid(emailChange)) {
        toast.warn('Неправильный формат "email"');
        return;
      }
      dispatch(authOperations.updateEmail({ email: emailChange }));
    }
    if (activElement === '2') {
      if (newPassword.length < 6) {
        toast.warn('Пароль не должен быть короче 6 символов');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.warn('Пароли не совпадают, пожалуйста, введите пароль еще раз');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }
      dispatch(authOperations.changePassword({ userId, oldPassword: password, newPassword: newPassword }));
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  useEffect(() => {
    !isFetchingUpdateName && setEditModeName(false);
  }, [isFetchingUpdateName]);

  useEffect(() => {
    !isFetchingUpdateEmail && setEditModeEmail(false);
  }, [isFetchingUpdateEmail]);

  useEffect(() => {
    !isFetchingUpdatePassword && setEditModePassword(false);
  }, [isFetchingUpdatePassword]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleOpenEditPassword = e => {
    const event = e.currentTarget.value;
    if (event === 'cancel') {
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setEditModePassword(!editModePassword);
  };

  const passwordForm = [
    { id: 'password', name: 'Пароль', value: password },
    { id: 'newPassword', name: 'Новый пароль', value: newPassword },
    { id: 'confirmPassword', name: 'Подтвердите пароль', value: confirmPassword },
  ];

  const personalDataForm = [
    {
      id: '0',
      name: 'name',
      label: 'Имя',
      value: nameChange,
      readOnly: editModeName,
      edit: true,
      handleClear: handleClearName,
    },
    {
      id: '1',
      name: 'email',
      label: 'Почта',
      value: emailChange,
      readOnly: editModeEmail,
      edit: true,
      handleClear: handleClearEmail,
    },
    {
      id: '2',
      name: 'date-register',
      label: 'Дата регистрации',
      value: moment(createdAt).format('DD MMMM YYYY [г.]'),
      readOnly: null,
      edit: false,
    },
  ];

  return (
    <div className="block__user-data">
      <div className="user-data__text-block">
        <p className="text-block__titlt">Личные данные</p>
        <p className="text-block__text">Чтобы изменить свои личные данные, отредактируйте и сохраните их здесь.</p>
      </div>
      {editModePassword ? (
        <div className="user-data__personal-data">
          {passwordForm.map(i => {
            return (
              <FormControl key={i.id} color="success" sx={{ width: '100%', marginTop: '36px' }} variant="standard">
                <InputLabel htmlFor="password">{i.name}</InputLabel>
                <Input
                  id={i.id}
                  type={showPassword ? 'text' : 'password'}
                  name={i.id}
                  value={i.value}
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
            );
          })}
        </div>
      ) : (
        <div className="user-data__personal-data">
          {personalDataForm.map(i => {
            return (
              <TextField
                key={i.name}
                sx={{ width: '100%', marginTop: '36px' }}
                id={i.name}
                name={i.name}
                label={i.label}
                value={i.value}
                type={i.name}
                onChange={handleChange}
                slotProps={{
                  input: {
                    readOnly: !i.readOnly,
                    endAdornment: i.edit && (
                      <InputAdornment position="end">
                        {i.readOnly ? (
                          <Box sx={{ m: 1, position: 'relative' }}>
                            <IconButton onClick={OnSumbitUserData} value={i.id}>
                              <CheckIcon />
                            </IconButton>
                            {isFetchingUpdateName && (
                              <CircularProgress
                                size={30}
                                sx={{
                                  color: 'var(--color-02)',
                                  position: 'absolute',
                                  top: 4,
                                  left: 4,
                                  zIndex: 1,
                                }}
                              />
                            )}
                            <IconButton onClick={i.handleClear}>
                              <ClearIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          <IconButton onClick={handleEdit} value={i.id}>
                            <EditIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
              />
            );
          })}
        </div>
      )}
      <div className="user-data__block-btn">
        {editModePassword ? (
          <Box sx={{ position: 'relative' }}>
            <IconButton onClick={OnSumbitUserData} value="2">
              <CheckIcon />
            </IconButton>
            {isFetchingUpdateName && (
              <CircularProgress
                size={30}
                sx={{
                  color: 'var(--color-02)',
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  zIndex: 1,
                }}
              />
            )}
            <IconButton onClick={handleOpenEditPassword} value="cancel">
              <ClearIcon />
            </IconButton>
          </Box>
        ) : (
          <Button type="button" variant="outlined" onClick={handleOpenEditPassword}>
            Изменить пароль
          </Button>
        )}
      </div>
    </div>
  );
};
