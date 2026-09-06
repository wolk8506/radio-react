import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelectors, recipeOperations, recipeActions, recipeSelectors } from 'store';

import sprite from './sprite.svg';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';

import { categoryList } from './ComponentDataCategory';

export const RecipesIndex = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const { categories } = useSelector(recipeSelectors.getRecipeCategories);
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    dispatch(recipeOperations.fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length > 0) {
      setMenuList(categoryList.filter(item => categories.includes(item.key)));
    }
  }, [categories]);

  const handleAddRecipe = () => {
    dispatch(recipeActions.setStatusAddRecipe());
    navigate('/recipes/recipes-add');
  };

  return (
    <>
      <div className="container-recipes">
        <div className="header">
          <Breadcrumbs aria-label="breadcrumb">
            <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
              <FastfoodIcon sx={{ mr: 0.5 }} />
              Рецепты
            </Typography>
          </Breadcrumbs>
          <div className="header__btn-block">
            <Button onClick={handleAddRecipe} disabled={isLoggedIn ? false : true}>
              <AddCircleOutlineIcon /> Добавить рецепт
            </Button>
          </div>
        </div>

        <ul className="menu-list">
          {menuList.length > 0 &&
            menuList.map(i => {
              return (
                <li className="menu-item" key={i.key}>
                  <Link to={i.link}>
                    <svg className="icon" width="36" height="36">
                      <use href={`${sprite}${i.svgId}`}></use>
                    </svg>
                    {i.name}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};
