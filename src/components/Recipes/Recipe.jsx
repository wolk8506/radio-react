import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';

import { getLoadingDeleteRecipe, getRecipe, getStatusDeleteRecipe } from 'store/recipe/selectors';
import { deleteRecipe } from 'store/recipe/operations';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import images from './img/load.gif';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import CreateIcon from '@mui/icons-material/Create';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import sprite from './sprite.svg';
import { getFavorites, getIsLoggedIn, getUserID } from 'store/auth/selectors';
import { setStatusDeleteRecipe, setStatusUpdateRecipe } from 'store/recipe/actions';
import { BASE_URL } from 'store/env';
import { deleteFile } from 'store/files/operations';
import { removeRecipeFavoriteById, updateRecipeFavoriteById } from 'store/auth/operations';
import { categoryList } from './ComponentDataCategory';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '402px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
};

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable nodeRef={nodeRef} handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

export const Recipe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dataRecipe = useSelector(getRecipe);
  const userID = useSelector(getUserID);
  const favorites = useSelector(getFavorites);
  const isLoggedIn = useSelector(getIsLoggedIn);
  const LoadingDeleteRecipe = useSelector(getLoadingDeleteRecipe);
  const StatusDeleteRecipe = useSelector(getStatusDeleteRecipe);
  const baseURL = BASE_URL + '/files';
  const category_ID = location.pathname.split('/')[2];
  const _ID = location.pathname.split('/')[3];

  const [recipe, setRecipe] = useState({});
  const [open, setOpen] = useState(false);
  const [imgModal, setImgModal] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (dataRecipe.lenght !== 0) {
      const dataFilter = dataRecipe.find(c => c._id === _ID);
      if (dataFilter?.lenght !== 0) if (dataFilter) setRecipe(dataFilter);
    }
  }, [_ID, dataRecipe]);

  const handleOpen = img => {
    setOpen(true);
    setImgModal(img);
  };
  const handleClose = () => setOpen(false);

  // --------------------------------------------------------------------------------------

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogAndDelete = () => {
    setOpenDialog(false);

    const deleteImg = [];
    recipe?.img && deleteImg.push(recipe.img);
    recipe?.steps.forEach(i => {
      if (i.img) deleteImg.push(i.img);
    });

    deleteImg.length > 0 && dispatch(deleteFile(deleteImg)); // Удаление файлов с сервера
    dispatch(deleteRecipe(_ID));
  };

  useEffect(() => {
    if (StatusDeleteRecipe) navigate(`/recipes/${category_ID}`);
    dispatch(setStatusDeleteRecipe());
  }, [StatusDeleteRecipe, dispatch, category_ID, navigate, recipe]);

  // -------------------------------------------------

  const helpText = 'Добавить в избранное, редактировать и удалять, можно только свои рецепты.';

  const handleEdit = () => {
    dispatch(setStatusUpdateRecipe());
    navigate(`/recipes/${category_ID}/${_ID}/edit`);
  };

  const handleAddToFavorites = () => {
    dispatch(updateRecipeFavoriteById(_ID));
  };

  const handleRemoveFromFavorites = () => {
    dispatch(removeRecipeFavoriteById(_ID));
  };

  return (
    <>
      {recipe._id && (
        <div className="container container-recipes">
          <div className="header">
            <Breadcrumbs aria-label="breadcrumb">
              <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
                <FastfoodIcon sx={{ mr: 0.5 }} />
                Рецепты
              </Link>
              <Link sx={{ display: 'flex', alignItems: 'center' }} to={`/recipes/${category_ID}`}>
                <svg className="icon" width="24" height="24">
                  {<use href={`${sprite}#icon-${category_ID}`}></use>}
                </svg>
                {categoryList.find(c => c.key === category_ID).name}
              </Link>
              <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                {recipe.name}
              </Typography>
            </Breadcrumbs>
            <div className="header__btn-block">
              {favorites && favorites.find(c => c === _ID) ? (
                <Button onClick={handleRemoveFromFavorites} disabled={isLoggedIn ? false : true}>
                  <FavoriteIcon />
                </Button>
              ) : (
                <Button onClick={handleAddToFavorites} disabled={isLoggedIn ? false : true}>
                  <FavoriteBorderIcon />
                </Button>
              )}
              <Button onClick={handleEdit} disabled={userID === recipe.owner ? false : true}>
                <CreateIcon />
              </Button>
              <Button onClick={handleClickOpenDialog} disabled={userID === recipe.owner ? false : true}>
                <DeleteIcon />
              </Button>
              <Tooltip title={helpText}>
                <HelpOutlineIcon className="btn-block__help" />
              </Tooltip>
            </div>
          </div>

          <h2>{recipe.name}</h2>
          <div className="ingredients">
            <img
              className="ingredients__img"
              src={recipe.img ? `${baseURL}${recipe.img}` : images}
              alt={recipe.name}
              width={412}
              height={412}
            />
            <div>
              <h3 className="ingredients__title">ИНГРЕДИЕНТЫ</h3>
              <ul>
                {recipe.ingredients &&
                  recipe.ingredients.map(i => (
                    <li key={i.i_name}>
                      <p className="item">
                        <span className="i-name">{i.i_name}</span>
                        <span className="bracket-line"></span>
                        <span className="i-weight">{i.i_weight}</span>
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {undefined !== recipe.steps[0]?.text && '' !== recipe.steps[0]?.text && null !== recipe.steps[0]?.text && (
            <div className="step">
              <h3 className="step__title">ПОШАГОВЫЙ РЕЦЕПТ ПРИГОТОВЛЕНИЯ</h3>
              <ol>
                {recipe.steps.map((i, index) => (
                  <li className="item-step" key={i.step}>
                    <i className="item-step__marker">{index + 1}.</i>
                    {i.img && (
                      <img
                        className="item-step__img"
                        src={`${baseURL}${i.img}`}
                        alt=""
                        width={200}
                        onClick={() => handleOpen(`${baseURL}${i.img}`)}
                      />
                    )}
                    <p className="item-step__discription">{i.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
              <Box sx={style} onClick={handleClose}>
                <img src={imgModal} alt="" style={{ width: '100%' }} onClick={handleClose} />
              </Box>
            </Modal>

            <Dialog
              open={openDialog}
              onClose={handleClose}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Удалить рецепт
              </DialogTitle>
              <DialogContent>
                <DialogContentText>{`Вы уверены что хотите удалить рецепт - "${recipe.name}"`}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleCloseDialog}>
                  Отмена
                </Button>
                <Button onClick={handleCloseDialogAndDelete}>Удалить</Button>
              </DialogActions>
            </Dialog>
          </div>
          <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={LoadingDeleteRecipe}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
    </>
  );
};
