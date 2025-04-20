import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAvatar, getUsername, getCreatedAt, getEmail, getIsLoggedIn } from '../store/auth/selectors';
import { fetchCurrentUser, logOut, updateName, updateEmail, updateAvatar } from '../store/auth/operations';
import { BASE_URL } from 'store/env';

import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import moment from 'moment';

export const UserView = () => {
  const dispatch = useDispatch();
  const avatar = useSelector(getAvatar);
  const name = useSelector(getUsername);
  const email = useSelector(getEmail);
  const createdAt = useSelector(getCreatedAt);
  const isLoggedIn = useSelector(getIsLoggedIn);
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
    console.log(e.currentTarget.value);
    console.log(Number(e.currentTarget.value));
    setModalVariant(Number(e.currentTarget.value));
  };
  const handleClose = () => setOpen(false);

  const UploadContent = e => {
    e.preventDefault();
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  // const OnSumbit = e => {
  //   const formData = new FormData();
  //   formData.append('avatar', file);

  //   dispatch(
  //     updateAvatar(formData, {
  //       headers: {
  //         'Content-type': 'multipart/form-data',
  //       },
  //     })
  //   );
  //   setOpen(false);
  // };
  // ------------------------------

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

        <Button type="button" variant="outlined" color="success" onClick={() => dispatch(logOut())}>
          Выход
        </Button>
      </nav>
      <div className="container-user__block">
        <table className="user-info">
          <tr className="user-info__item">
            <td className="item__title">Аватар:</td>
            <td>
              <img className="item__img" src={baseUrlImg + avatar} alt="" width={128} />
            </td>
            <td>
              <Button onClick={handleOpen} value={0}>
                <EditIcon />
              </Button>
            </td>
          </tr>
          <tr className="user-info__item">
            <td className="item__title">Имя:</td>
            <td className="item__text">{name}</td>
            <td>
              <Button onClick={handleOpen} value="1">
                <EditIcon />
              </Button>
            </td>
          </tr>
          <tr className="user-info__item">
            <td className="item__title">Почта:</td>
            <td className="item__text">{email}</td>
            <td>
              <Button onClick={handleOpen} value="2">
                <EditIcon />
              </Button>
            </td>
          </tr>
          <tr className="user-info__item">
            <td className="item__title">Дата регистрации:</td>
            <td className="item__text">{moment(createdAt).format('DD MMMM YYYY [г.]')}</td>
            <td></td>
          </tr>
        </table>
      </div>
      <div>
        {/* <Modal
          open={open1}
          onClose={handleClose1}
          aria-labelledby="modal-title-avatar"
          aria-describedby="modal-description-avatar"
        >
          <Box sx={style}>
            <Typography id="modal-title-avatar" variant="h6" component="h2">
              Change avatar
            </Typography>
            <Typography id="modal-description-avatar" sx={{ mt: 2 }}>
              To change the avatar, select the file
            </Typography>
            <TextField
              id="avatar"
              variant="standard"
              name="avatar"
              accept="image/png"
              type="file"
              onChange={UploadContent}
              color="success"
            />
            <Button type="submit" onClick={OnSumbit}>
              Change
            </Button>
          </Box>
        </Modal> */}
      </div>
      <div>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
          <Box sx={style}>
            <Typography id="modal-title" variant="h6" component="h2">
              {`${modalData[modalVariant].title} `}
              <span className="modal-title-value">{modalData[modalVariant].currentValue}</span>
            </Typography>
            {modalVariant === 0 && (
              <Typography id="modal-description" sx={{ mt: 2 }}>
                To change the avatar, select the file
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
                color="success"
              />
            ) : (
              <TextField
                id={modalData[modalVariant].id}
                variant="standard"
                name={modalData[modalVariant].id}
                type={modalData[modalVariant].currentValue}
                onChange={handleChangeName}
                color="success"
              />
            )}
            <Button type="submit" onClick={OnSumbitChangeName}>
              Change
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};
