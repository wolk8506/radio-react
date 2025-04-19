import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// import { useSelector } from 'react-redux';
import { getLoadingDeleteRecipe, getRecipe, getStatusDeleteRecipe } from 'store/recipe/selectors';
import { deleteRecipe, favoriteRecipe } from 'store/recipe/operations';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { data_cake as cake } from './data/data_cake';
import { data_soup as soup } from './data/data_soup';
import { data_cocktail as cocktail } from './data/data_cocktail';
import { data_desert as desert } from './data/data_desert';
import { data_meat as meat } from './data/data_meat';
import { data_salad as salad } from './data/data_salad';
import { data_sousy as sousy } from './data/data_sousy';
import { data_zagotovki as zagotovki } from './data/data_zagotovki';
import { data_zakuski as zakuski } from './data/data_zakuski';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// import { Button } from '@mui/material';
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
import Draggable from 'react-draggable';
import sprite from './sprite.svg';
import { getUserID } from 'store/auth/selectors';
import { setStatusDeleteRecipe } from 'store/recipe/actions';

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
  const dataRecipe = useSelector(getRecipe);
  console.log(dataRecipe);
  const userID = useSelector(getUserID);
  const LoadingDeleteRecipe = useSelector(getLoadingDeleteRecipe);
  const StatusDeleteRecipe = useSelector(getStatusDeleteRecipe);

  const location = useLocation();
  const item_ID = location.pathname.split('/')[2];
  const ID = Number(location.pathname.split('/')[3]) - 1;
  const _ID = location.pathname.split('/')[3];
  const data = { cake, soup, cocktail, desert, meat, salad, sousy, zagotovki, zakuski };

  const [recipe, setRecipe] = useState(data[item_ID][ID]);
  // console.log(_ID);
  useEffect(() => {
    if (dataRecipe.lenght !== 0) {
      const dataFilter = dataRecipe.find(c => c._id === _ID);
      console.log(dataFilter);

      if (dataFilter?.lenght !== 0) if (dataFilter) setRecipe(dataFilter);
    }
  }, [_ID, dataRecipe]);

  const pageName = {
    cake: 'Выпечка',
    soup: 'Первые блюда',
    cocktail: 'Коктейли',
    desert: 'Десерты',
    meat: 'Вторые блюда',
    salad: 'Салаты',
    sousy: 'Соусы',
    zagotovki: 'Заготовки на зиму',
    zakuski: 'Закуски',
  };

  const [open, setOpen] = useState(false);
  const [imgModal, setImgModal] = useState();
  const handleOpen = img => {
    setOpen(true);
    setImgModal(img);
  };
  const handleClose = () => setOpen(false);

  // --------------------------------------------------------------------------------------
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialogAndDelete = () => {
    setOpenDialog(false);
    dispatch(deleteRecipe(_ID));
  };

  useEffect(() => {
    console.log('pach', `/recipes/${item_ID}`);

    if (StatusDeleteRecipe) navigate(`/recipes/${item_ID}`);
    dispatch(setStatusDeleteRecipe());
  }, [StatusDeleteRecipe, dispatch, item_ID, navigate]);

  // -------------------------------------------------
  // const [favorite, setFavorite] = useState(false);
  const helpText = 'Добавить в избранное, редактировать и удалять, можно только свои рецепты.';
  const handleFavorite = () => {
    // setFavorite(!favorite);
    console.log({ _id: recipe._id, favorite: recipe.favorite });
    dispatch(favoriteRecipe({ _id: recipe._id, favorite: recipe.favorite }));
  };
  const handleEdit = () => {
    // console.log('edit');
    navigate(`/recipes/${item_ID}/${_ID}/edit`);
  };

  return (
    <>
      {recipe && (
        <div className="container container-recipes">
          <div className="header">
            <Breadcrumbs aria-label="breadcrumb">
              <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
                <FastfoodIcon sx={{ mr: 0.5 }} />
                Рецепты
              </Link>
              <Link sx={{ display: 'flex', alignItems: 'center' }} to={`/recipes/${item_ID}`}>
                <svg className="icon" width="24" height="24">
                  {'soup' === item_ID && <use href={`${sprite}#icon-soup`}></use>}
                  {'meat' === item_ID && <use href={`${sprite}#icon-meat`}></use>}
                  {'salad' === item_ID && <use href={`${sprite}#icon-salad`}></use>}
                  {'zakuski' === item_ID && <use href={`${sprite}#icon-zakuski`}></use>}
                  {'cake' === item_ID && <use href={`${sprite}#icon-cake`}></use>}
                  {'desert' === item_ID && <use href={`${sprite}#icon-desert`}></use>}
                  {'cocktail' === item_ID && <use href={`${sprite}#icon-cocktail`}></use>}
                  {'sousy' === item_ID && <use href={`${sprite}#icon-sousy`}></use>}
                  {'zagotovki' === item_ID && <use href={`${sprite}#icon-zagotovki`}></use>}
                </svg>
                {pageName[item_ID]}
              </Link>
              <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                {recipe.name}
              </Typography>
            </Breadcrumbs>
            <div className="header__btn-block">
              <Button onClick={handleFavorite} disabled={userID === recipe.owner ? false : true}>
                {recipe?.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </Button>
              <Button
                onClick={handleEdit}
                disabled={userID === recipe.owner ? false : true}
                // disabled={true}
              >
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
              src={recipe.img ? recipe.img : images}
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
                        src={i.img}
                        alt=""
                        width={200}
                        onClick={() => handleOpen(i.img)}
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

            {/* <React.Fragment> */}

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
            {/* </React.Fragment> */}
          </div>
          <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={LoadingDeleteRecipe}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
    </>
  );
};
