import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SaveIcon from '@mui/icons-material/Save';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { favoriteRecipe, updateRecipe } from 'store/recipe/operations';
import { getLoadingUpdateRecipe, getRecipe, getStatusUpdateRecipe } from 'store/recipe/selectors';
import { setStatusUpdateRecipe } from 'store/recipe/actions';
import { BASE_URL } from '../../config';
import { deleteFile, uploadFiles } from 'store/files/operations';
import { getLoadingUploadFiles } from 'store/files/selectors';
import { ImageBlock } from './ComponentRecipeImg';
import sprite from './sprite.svg';
import { getUserID } from 'store/auth/selectors';
import { categoryList } from './ComponentDataCategory';

export const RecipeUpdate = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userID = useSelector(getUserID);
  const dataRecipe = useSelector(getRecipe);
  const loadingUpdateRecipe = useSelector(getLoadingUpdateRecipe);
  const loadingUploadFiles = useSelector(getLoadingUploadFiles);
  const statusUpdateRecipe = useSelector(getStatusUpdateRecipe);

  const pathSegments = location.pathname.split('/');
  const category_ID = pathSegments[2];
  const _ID = pathSegments[3];

  const [recipe, setRecipe] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [stepsList, setStepsList] = useState([]);
  const timestamp = Date.now(); //  # Добавляем метку времени для уникальности
  const [deleteImg, setDeleteImg] = useState([]); //  # Массив для хранения удаляемых изображений
  const [titleBlock, setTitleBlock] = useState({
    name: '',
    category: '',
    img: null,
    file: null,
    imgOldURL: null,
    imgNewURL: null,
    imgChange: true,
  }); //  # Заголовок блока

  // ~ Поиск рецепта для редактирования
  useEffect(() => {
    const foundRecipe = dataRecipe.find(c => c._id === _ID);
    setRecipe(foundRecipe);
  }, [_ID, dataRecipe]);

  // -------------------------------------------------------------
  //  ~ Обработка загрузки файла главного изображения
  const handleFileChange = event => {
    const selectedFile = event.target.files[0]; // Берём только один файл
    if (!selectedFile) return;

    // Генерируем новое имя файла, очищая недопустимые символы
    const sanitizeFileName = selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const newFileName = `${timestamp}_${sanitizeFileName}`;
    // Создаём новый файл с новым именем через Blob
    const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
    setTitleBlock(prevState => ({
      ...prevState,
      img: URL.createObjectURL(renamedFile),
      file: renamedFile, //file
      imgOldURL: null, //imgOldURL
      imgNewURL: `/recipe/${newFileName}`,
      imgChange: true, //imgChange
    }));
  };

  //  ~ Удаление текущего файла
  const handleDeleteMainImage = () => {
    !titleBlock.imgChange && setDeleteImg(prev => [...prev, titleBlock.imgOldURL]);
    setTitleBlock(prevState => ({
      ...prevState,
      img: null,
      file: null, //file
      imgOldURL: null, //imgOldURL
      imgNewURL: null, //imgOldURL
      imgChange: true, //imgChange
    }));
  };

  // -----------------------------------------------------------------

  //  ~ Изменение категории рецепта
  const handleChangeCategory = e =>
    setTitleBlock(prevState => ({
      ...prevState,
      category: e.target.value,
    }));

  //  ~ Добавление новой строки ингридиенты клавишей 'Enter'
  const handleKeyDownAddItemIngridient = e => {
    if (e.key === 'Enter') handleAddInggedient();
  };

  //  ~ Добавление новой строки шаг клавишей 'Enter'
  const handleKeyDownAddItemStep = e => {
    if (e.key === 'Enter') handleAddSteps();
  };

  //  ~ Добавление нового ингридиента
  const handleAddInggedient = () => {
    setIngredientList([...ingredientList, { id: timestamp, i_name: '', i_weight: '' }]);
  };

  //  ~ Запись данных ингридиенты рецепта
  const handleIngredientName = e => {
    const id = Number(e.target.id.split('-')[1]);
    const itemName = e.target.id.split('-')[0];
    const itemValue = e.target.value;

    setIngredientList(prevList => {
      const exists = prevList.some(item => item.id === id);
      return (
        exists &&
        prevList.map(item =>
          item.id === id
            ? itemName === 'i_name'
              ? { ...item, i_name: itemValue }
              : { ...item, i_weight: itemValue }
            : item
        )
      );
    });
  };

  //  ~ Удаление строки ингридиента
  const handleIngredientDelete = id => {
    setIngredientList(prevList => prevList.filter(item => item.id !== id));
  };

  //  ~ Добавление шага приготовления
  const handleAddSteps = () => {
    setStepsList([
      ...stepsList,
      { step: timestamp, text: '', img: null, file: null, imgOldURL: null, imgNewURL: null, imgChange: true },
    ]);
  };

  //  ~ Запись данных шаги рецепта
  const handleStepsName = e => {
    const id = Number(e.target.id.split('-')[1]);
    const itemName = e.target.id.split('-')[0];
    const itemValue = e.target.value;
    const selectedFiles = e.target.files;
    let renamedFile;
    let previewUrl;
    let newFileName;
    let urlImgInDB;

    if (itemName === 'uploadFile') {
      const sanitizeFileName = selectedFiles[0].name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      newFileName = `${timestamp}_${sanitizeFileName}`;
      urlImgInDB = `/recipe/${timestamp}_${sanitizeFileName}`;
      // # Создаем новый файл с новым именем через Blob
      renamedFile = new File(selectedFiles, newFileName, { type: selectedFiles[0].type });
      previewUrl = URL.createObjectURL(renamedFile);
    }

    setStepsList(prevList => {
      const exists = prevList.some(item => item.step === id);
      return (
        exists &&
        prevList.map(item =>
          item.step === id
            ? itemName === 'text'
              ? { ...item, text: itemValue }
              : { ...item, img: previewUrl, file: renamedFile, imgOldURL: null, imgNewURL: urlImgInDB, imgChange: true }
            : item
        )
      );
    });
  };

  //  ~ Удаление выбранного изображения из шага
  const handleDeleteImage = id => {
    const selectedItem = stepsList.find(item => item.step === id);
    !selectedItem.imgChange && setDeleteImg(prev => [...prev, selectedItem.imgOldURL]);

    setStepsList(prevList => {
      return prevList.map(item => {
        return item.step === id
          ? { ...item, img: null, file: null, imgOldURL: null, imgNewURL: null, imgChange: true }
          : item;
      });
    });
  };
  //  ~ Удаление выбранного шага
  const handleStepsDelete = id => {
    const selectedItem = stepsList.find(item => item.step === id);
    !selectedItem.imgChange && setDeleteImg(prev => [...prev, selectedItem.imgOldURL]);

    setStepsList(prevList => prevList.filter(item => item.step !== id));
  };

  //  ~ Запись данных из рецепта в форму для редактирования
  useEffect(() => {
    if (recipe.length === 0) return;
    setTitleBlock(prevState => ({
      ...prevState,
      name: recipe.name,
      category: recipe.category,
      img: recipe.img ? `${BASE_URL}/files${recipe.img}` : null,
      file: null, //file
      imgOldURL: recipe.img, //imgOldURL
      imgChange: false, //imgChange
    }));

    setStepsList(
      recipe.steps.map((i, index) => {
        return {
          step: index,
          text: i.text,
          img: i.img ? `${BASE_URL}/files${i.img}` : null,
          imgChange: false,
          file: null,
          imgOldURL: i.img,
        };
      })
    );

    setIngredientList(
      recipe.ingredients.map((i, index) => {
        return { id: index, i_name: i.i_name, i_weight: i.i_weight };
      })
    );
  }, [recipe]);

  //  ~ Подготовка и отправка массива данных на сервер

  // ---------------------------------------------------
  const handleSave = () => {
    const recipe = {
      name: titleBlock.name,
      img: titleBlock.imgChange ? titleBlock.imgNewURL : titleBlock.imgOldURL,
      category: titleBlock.category,
      ingredients: ingredientList
        .map(i => {
          return i.i_name !== '' || i.i_weight !== '' ? { i_name: i.i_name, i_weight: i.i_weight } : null;
        })
        .filter(item => item !== null),
      steps: stepsList
        .map((i, index) => {
          return i.text !== '' || i.img !== null
            ? { step: index + 1, text: i.text, img: i.imgChange ? i.imgNewURL : i.imgOldURL }
            : null;
        })
        .filter(item => item !== null),
    };

    dispatch(updateRecipe({ _id: _ID, recipe }));

    //  # Отправка файлов на сервер
    const formData = new FormData();
    titleBlock.imgChange && titleBlock.file && formData.append('files', titleBlock.file); // Один файл
    stepsList.forEach(file => {
      file.imgChange && file.file && formData.append('files', file.file); // Один файл
    });

    deleteImg.length && dispatch(deleteFile(deleteImg)); // Удаление файлов с сервера

    formData.getAll('files').length > 0 &&
      dispatch(
        uploadFiles(formData, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        })
      );

    // #  Loading on
    setRedirectLoading(true);
  };
  // ---------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  useEffect(() => {
    setLoading(loadingUpdateRecipe && loadingUploadFiles);
    const timer = setTimeout(() => {
      statusUpdateRecipe && !loadingUploadFiles && setLoading(true);
      loadingUpdateRecipe && loadingUploadFiles && setRedirectLoading(true);
    }, 3000);
    // Clear timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [loadingUpdateRecipe, loadingUploadFiles, statusUpdateRecipe]);

  //  ~ Редирект после сохранения
  useEffect(() => {
    if (loading) navigate(`/recipes/${category_ID}/${_ID}`);

    if (loading) dispatch(setStatusUpdateRecipe());
  }, [_ID, dispatch, category_ID, loading, navigate]);

  //  ~ Редирект после отмены сохранения
  const handleCancel = () => navigate(`/recipes/${category_ID}/${_ID}`);

  const helpText =
    'Можно добавить только 20 изображений в одном этапе редактирования. Ограничений по шагам и ингридиентам нет.';
  const handleFavorite = () => {
    dispatch(favoriteRecipe({ _id: recipe._id, favorite: recipe.favorite }));
  };

  return (
    <div className="container-recipe-add">
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
          <Link sx={{ display: 'flex', alignItems: 'center' }} to={`/recipes/${category_ID}/${_ID}`}>
            {recipe.name}
          </Link>
          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
            Обновление рецепта
          </Typography>
        </Breadcrumbs>
        <div className="header__btn-block">
          <Button onClick={handleFavorite} disabled={userID === recipe.owner ? false : true}>
            {recipe?.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Button>

          <Tooltip title={helpText}>
            <HelpOutlineIcon className="btn-block__help" />
          </Tooltip>
        </div>
      </div>

      <div className="overflov">
        <div className="main-block">
          <h3 className="main-block__title">Название рецепта | лого | категория</h3>
          <div className="main-block__description">
            <ImageBlock
              step={'main'}
              img={titleBlock.img}
              onDeleteImage={handleDeleteMainImage}
              onFileChange={handleFileChange}
            />
            <div className="description__input-block">
              <TextField
                value={titleBlock.name}
                sx={{ width: '100%', marginBottom: '16px', paddingBottom: '19px' }}
                id="name"
                label="Название рецепта"
                onChange={e => setTitleBlock({ ...titleBlock, name: e.target.value })}
                type="text"
                multiline
                rows={3}
              />
              <FormControl fullWidth sx={{ width: '100%' }}>
                <InputLabel id="category-select-label">Категория</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={titleBlock.category}
                  label="Категория"
                  onChange={handleChangeCategory}
                >
                  {categoryList.map(i => {
                    return (
                      <MenuItem key={i.key} value={i.key}>
                        {i.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="ingredient">
          <h3 className="ingredient__title">Ингридиенты</h3>
          {ingredientList.map((i, index) => {
            return (
              <div key={i.id} className="ingredient__item">
                <h5 className="item__title">Ингридиент #{index + 1}</h5>
                <div className="ingredient-item">
                  <TextField
                    value={i.i_name}
                    sx={{ width: '400px', marginRight: '12px' }}
                    id={`i_name-${i.id}`}
                    label="Название"
                    onChange={handleIngredientName}
                    autoFocus={index === ingredientList.length - 1 ? true : false}
                  />
                  <TextField
                    value={i.i_weight}
                    sx={{ width: '200px' }}
                    id={`i_weight-${i.id}`}
                    label="Количество"
                    onChange={handleIngredientName}
                    onKeyDown={handleKeyDownAddItemIngridient}
                  />

                  <Button
                    onClick={() => handleIngredientDelete(i.id)}
                    disabled={ingredientList.length > 1 ? false : true}
                  >
                    <RemoveCircleIcon />
                  </Button>
                </div>
              </div>
            );
          })}
          <Button onClick={handleAddInggedient}>
            <AddCircleOutlineIcon />
          </Button>
        </div>

        <div className="step">
          <h3 className="step__title">Шаги приготовления</h3>
          <div>
            {stepsList.map((i, index) => {
              return (
                <div key={index} className="step__item">
                  <h5 className="item__title">Описание приготовления шаг #{index + 1}</h5>
                  <div className="item__description-bloc">
                    <div className="description-blo__input-element">
                      <ImageBlock
                        step={i.step}
                        img={i.img}
                        onDeleteImage={handleDeleteImage}
                        onFileChange={handleStepsName}
                      />

                      <TextField
                        value={i.text}
                        sx={{ width: '396px' }}
                        id={`text-${i.step}`}
                        label="Описание приготовления"
                        multiline
                        rows={7}
                        onChange={handleStepsName}
                        onKeyDown={handleKeyDownAddItemStep}
                        autoFocus={i.step === stepsList.length - 1 ? true : false}
                      />
                    </div>

                    <Button onClick={() => handleStepsDelete(i.step)} disabled={stepsList.length > 1 ? false : true}>
                      <RemoveCircleIcon />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleAddSteps}>
            <AddCircleOutlineIcon />
          </Button>
        </div>
        <div className="save-block">
          <Button onClick={handleSave}>
            <SaveIcon /> <span>СОХРАНИТЬ</span>
          </Button>
          <Button onClick={handleCancel}>
            <DoDisturbAltIcon /> <span>ОТМЕНА</span>
          </Button>
        </div>
      </div>
      <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={redirectLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
