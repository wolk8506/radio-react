import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getAvatar,
  getUsername,
  getCreatedAt,
  getEmail,
  getIsLoggedIn,
  getIsFetchingUploadAvatar,
} from '../store/auth/selectors';
import { fetchCurrentUser, logOut, updateName, updateEmail, updateAvatar } from '../store/auth/operations';
import { BASE_URL } from 'store/env';

import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';

import moment from 'moment';

export const UserView = () => {
  const dispatch = useDispatch();
  const avatar = useSelector(getAvatar);
  const name = useSelector(getUsername);
  const email = useSelector(getEmail);
  const createdAt = useSelector(getCreatedAt);
  const isLoggedIn = useSelector(getIsLoggedIn);
  const isFetchingUploadAvatar = useSelector(getIsFetchingUploadAvatar);
  const [nameChange, setNameChange] = useState(name);
  const baseUrlImg = BASE_URL;

  useEffect(() => {
    if (isLoggedIn) {
    }
    dispatch(fetchCurrentUser());
  }, [dispatch, isLoggedIn]);

  // ------------------------------
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const [modalVariant, setModalVariant] = useState(0);

  const handleOpen = e => {
    setOpen(true);
    setModalVariant(Number(e.currentTarget.value));
  };
  const handleClose = () => setOpen(false);

  const UploadContent = e => {
    e.preventDefault();
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChangeName = ({ target: { name, value } }) => {
    switch (name) {
      case 'name':
        return setNameChange(value);
      case 'email':
        return setNameChange(value);
      default:
        return;
    }
  };

  const OnSumbitChangeName = e => {
    const formData = new FormData();
    formData.append('avatar', file);

    if (modalVariant === 0) {
      dispatch(
        updateAvatar(formData, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        })
      );
    }

    if (modalVariant === 1) dispatch(updateName({ name: nameChange }));

    if (modalVariant === 2) dispatch(updateEmail({ email: nameChange }));
    setOpen(false);
  };

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
    display: 'flex',
    flexDirection: 'column',
  };

  const modalData = [
    { title: 'Изменить аватар', id: 'image', currentValue: '' },
    { title: 'Изменить имя', id: 'name', currentValue: name },
    { title: 'Изменить почту', id: 'email', currentValue: email },
  ];

  return (
    <div className="container-user">
      <nav className="navigation">
        <div className="navigation__user">
          <img className="user__avatar" src={baseUrlImg + avatar} alt="" width="32" />
          <span className="user__name">Привет, {name}</span>
        </div>

        <Button type="button" variant="outlined" onClick={() => dispatch(logOut())}>
          Выход
        </Button>
      </nav>
      <div className="container-user__block">
        <div className="block__user-info">
          <div className="user-info__item">
            <div className="item__name">Аватар:</div>
            <div className="item__value item__value--img">
              {isFetchingUploadAvatar ? (
                <CircularProgress />
              ) : (
                <img className="item__img" src={baseUrlImg + avatar} alt="" width={128} />
              )}
            </div>
            <div className="item__btn">
              <Button onClick={handleOpen} value="0">
                <EditIcon />
              </Button>
            </div>
          </div>
          <div className="user-info__item">
            <div className="item__name">Имя:</div>
            <div className="item__value">{name}</div>
            <div className="item__btn">
              <Button onClick={handleOpen} value="1">
                <EditIcon />
              </Button>
            </div>
          </div>
          <div className="user-info__item">
            <div className="item__name">Почта:</div>
            <div className="item__value">{email}</div>
            <div className="item__btn">
              <Button onClick={handleOpen} value="2">
                <EditIcon />
              </Button>
            </div>
          </div>
          <div className="user-info__item">
            <div className="item__name">Дата регистрации:</div>
            <div className="item__value">{moment(createdAt).format('DD MMMM YYYY [г.]')}</div>
            <div className="item__btn"></div>
          </div>
        </div>
      </div>
      <div></div>
      <div>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
          <Box sx={style}>
            <Typography id="modal-title" variant="h6" component="h2">
              {`${modalData[modalVariant].title} `}
              <span className="modal-title-value">{modalData[modalVariant].currentValue}</span>
            </Typography>
            {modalVariant === 0 && (
              <Typography id="modal-description" sx={{ mt: 2 }}>
                Чтобы изменить аватар, выберите файл
              </Typography>
            )}
            {modalVariant === 0 ? (
              <TextField
                id="avatar"
                variant="standard"
                name="avatar"
                accept="image/png"
                type="file"
                onChange={UploadContent}
                sx={{ marginBottom: '24px', marginTop: '24px' }}
              />
            ) : (
              <TextField
                id={modalData[modalVariant].id}
                variant="standard"
                name={modalData[modalVariant].id}
                type={modalData[modalVariant].currentValue}
                onChange={handleChangeName}
                sx={{ marginBottom: '24px', marginTop: '24px' }}
              />
            )}
            <Button type="submit" onClick={OnSumbitChangeName}>
              Изменить
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};
