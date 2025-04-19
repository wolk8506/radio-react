import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipe } from 'store/recipe/selectors';

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

import sprite from './sprite.svg';
// import { useState } from 'react';

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

export const Cake = () => {
  const dataRecipe = useSelector(getRecipe);
  const location = useLocation();
  const item_ID = location.pathname.split('/')[2];
  const ID = Number(location.pathname.split('/')[3]);
  const _ID = location.pathname.split('/')[3];
  const data = { cake, soup, cocktail, desert, meat, salad, sousy, zagotovki, zakuski };
  // const recept = ;

  const [recept, setDataNew] = useState(data[item_ID][Number(ID)]);
  console.log('recept', recept);
  useEffect(() => {
    console.log(dataRecipe);
    // if (dataRecipe !== 0) {
    // console.log(dataRecipe[0]);
    const dataFilter = dataRecipe.filter(c => c._id?.toLowerCase().includes(_ID));
    // const dataFilter2 = dataFilter.filter(c => c.category?.toLowerCase().includes(item_ID));
    console.log(dataFilter);

    if (dataFilter.lenght !== 0) setDataNew(dataFilter);
    // }
  }, [ID, _ID, dataRecipe, item_ID]);

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

  return (
    <>
      <div className="container container-recipes">
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
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>{recept.name}</Typography>
        </Breadcrumbs>
        <h2>{recept.name}</h2>
        <div className="ingredients">
          <img className="ingredients__img" src={recept.img} alt={recept.name} width={412} height={412} />
          <div>
            <h3 className="ingredients__title">ИНГРЕДИЕНТЫ</h3>
            <ul>
              {recept.ingredients &&
                recept.ingredients.map(i => (
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

        {'' !== recept.steps[0].text && (
          <div className="step">
            <h3 className="step__title">ПОШАГОВЫЙ РЕЦЕПТ ПРИГОТОВЛЕНИЯ</h3>
            <ol>
              {recept.steps.map((i, index) => (
                <li className="item-step" key={i.step}>
                  <i className="item-step__marker">{index + 1}.</i>
                  {i.img && (
                    <img className="item-step__img" src={i.img} alt="" width={200} onClick={() => handleOpen(i.img)} />
                  )}
                  <p className="item-step__discription">{i.text}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} onClick={handleClose}>
              <img src={imgModal} alt="" style={{ width: '100%' }} onClick={handleClose} />
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};
