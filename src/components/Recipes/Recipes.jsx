import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipe } from 'store/recipe/operations';
import { getRecipe } from 'store/recipe/selectors';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import images from './img/load.gif';
import { categoryList } from './ComponentDataCategory';

import sprite from './sprite.svg';

import { BASE_URL } from 'store/env';
import { getFavorites } from 'store/auth/selectors';

const style = {
  width: '100%',
  maxWidth: 360,
  color: '#ffffff',
};

export const Recipes = () => {
  const dispatch = useDispatch();
  const baseURL = BASE_URL + '/files';

  useEffect(() => {
    dispatch(fetchRecipe());
  }, [dispatch]);

  const dataRecipe = useSelector(getRecipe);
  const favorites = useSelector(getFavorites);
  const location = useLocation();
  const category_ID = location.pathname.split('/')[2];
  const [dataNew, setDataNew] = useState([]);
  const [sortField, setSortField] = useState('none'); // Поле для сортировки: none, name, date
  const [sortOrder, setSortOrder] = useState('none'); // Направление сортировки: none, ascending, descending
  const [onlyFavorites, setOnlyFavorites] = useState(false); // Фильтр избранного
  const [searchQuery, setSearchQuery] = useState('');

  // Обновление данных на основе категории
  useEffect(() => {
    if (dataRecipe.length !== 0) {
      const dataFilter = dataRecipe.filter(c => c.category?.toLowerCase().includes(category_ID));
      setDataNew(dataFilter);
    }
  }, [dataRecipe, category_ID]);

  // Обработчик сортировки
  const handleSortToggle = field => {
    const nextOrder = sortOrder === 'none' ? 'ascending' : sortOrder === 'ascending' ? 'descending' : 'none';

    setSortField(field);
    setSortOrder(nextOrder);

    if (nextOrder === 'ascending') {
      const sortedData = [...dataNew].sort((a, b) =>
        field === 'name' ? a.name.localeCompare(b.name) : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setDataNew(sortedData);
    } else if (nextOrder === 'descending') {
      const sortedData = [...dataNew].sort((a, b) =>
        field === 'name' ? b.name.localeCompare(a.name) : new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDataNew(sortedData);
    } else {
      const dataFilter = dataRecipe.filter(c => c.category?.toLowerCase().includes(category_ID)); // Сброс
      setDataNew(dataFilter);
    }
  };

  // Обработчик поиска
  const handleSearch = e => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = dataRecipe.filter(
      recipe => recipe.category?.toLowerCase().includes(category_ID) && recipe.name.toLowerCase().includes(query)
    );
    setDataNew(filtered);
  };

  // Фильтрация избранного
  const handleFavoritesToggle = () => {
    setOnlyFavorites(!onlyFavorites);

    if (!onlyFavorites) {
      const filteredFavorites = dataRecipe.filter(
        recipe => recipe.category?.toLowerCase().includes(category_ID) && favorites.find(c => c === recipe._id)
      );
      setDataNew(filteredFavorites);
    } else {
      const dataFilter = dataRecipe.filter(c => c.category?.toLowerCase().includes(category_ID)); // Сброс
      setDataNew(dataFilter);
    }
  };

  const menu = dataNew.map(i => (
    <Link className="menu-item recipes__menu-item" key={i._id} to={`/recipes/${category_ID}/${i._id}`}>
      <ListItem>
        <img sx={{ width: '64px' }} src={i.img ? `${baseURL}${i.img}` : images} alt={''} width={64} />
        <ListItemText primary={i.name} />
        {favorites?.find(c => c === i._id) && <FavoriteIcon />}
      </ListItem>
    </Link>
  ));

  return (
    <>
      <div className="container container-recipes">
        <div className="header">
          <Breadcrumbs aria-label="breadcrumb">
            <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
              <FastfoodIcon sx={{ mr: 0.5 }} />
              Рецепты
            </Link>
            <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
              <svg className="icon" width="24" height="24">
                {<use href={`${sprite}#icon-${category_ID}`}></use>}
              </svg>
              {categoryList.find(c => c.key === category_ID).name}
            </Typography>
          </Breadcrumbs>
          <div className="header__btn-block">
            <TextField
              id="search"
              variant="standard"
              name="search"
              value={searchQuery}
              type="text"
              onChange={handleSearch}
              placeholder="Поиск по названию"
              sx={{ marginBottom: '24px', marginTop: '24px' }}
            />
            <Button onClick={() => handleSortToggle('name')}>
              {sortField === 'name' && sortOrder !== 'none' ? (
                sortOrder === 'ascending' ? (
                  <FilterListIcon sx={{ transform: 'rotate(180deg)' }} />
                ) : (
                  <FilterListIcon />
                )
              ) : (
                <FilterListOffIcon />
              )}
              по названию
            </Button>
            <Button onClick={() => handleSortToggle('date')}>
              {sortField === 'date' && sortOrder !== 'none' ? (
                sortOrder === 'ascending' ? (
                  <FilterListIcon sx={{ transform: 'rotate(180deg)' }} />
                ) : (
                  <FilterListIcon />
                )
              ) : (
                <FilterListOffIcon />
              )}
              по дате
            </Button>
            <Button onClick={handleFavoritesToggle}>{onlyFavorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}</Button>
          </div>
        </div>

        <List sx={style} component="nav" aria-label="mailbox folders">
          {menu}
        </List>
      </div>
    </>
  );
};
