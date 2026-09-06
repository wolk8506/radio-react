import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { fileSelector, recipeSelectors, authOperations, recipeOperations } from 'store';

import { ImageBlock } from './ComponentRecipeImg';
import { categoryList } from './ComponentDataCategory';

export const RecipeAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadingAddRecipe = useSelector(recipeSelectors.getLoadingAddRecipe);
  const statusAddRecipe = useSelector(recipeSelectors.getStatusAddRecipe);
  const loadingUploadFiles = useSelector(fileSelector.getLoadingUploadFiles);
  const helpText =
    'Можно добавить только 20 изображений в одном этапе редактирования. Ограничений по шагам и ингридиентам нет.';

  const [name, setName] = useState();
  const [img, setImg] = useState(null); // Имя файла для отправки на сервер
  const [category, setCategory] = useState('');
  const [ingredientList, setIngredientList] = useState([{ id: 0, i_name: '', i_weight: '' }]);
  const [stepsList, setStepsList] = useState([{ step: 0, text: '', img: null, imgDB: null, imgName: null }]);
  const [file, setFile] = useState(null); // Один файл
  const [previewUrl, setPreviewUrl] = useState(''); // URL для предпросмотра
  const timestamp = Date.now(); // Добавляем метку времени для уникальности

  // Обработка загрузки файла
  const handleFileChange = event => {
    const selectedFile = event.target.files[0]; // Берём только один файл
    if (!selectedFile) return;

    // Генерируем новое имя файла, очищая недопустимые символы
    const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const newFileName = `${timestamp}_${sanitizedName}`;
    setImg(`/recipe/${newFileName}`); // Сохраняем новое имя файла в состоянии

    // Создаём новый файл с новым именем через Blob
    const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
    setFile(renamedFile);
    // Генерация URL для предпросмотра
    const preview = URL.createObjectURL(renamedFile);
    setPreviewUrl(preview);
  };

  // Удаление текущего файла
  const handleDeleteMainImage = () => {
    setFile(null);
    setPreviewUrl('');
    setImg(null); // Сбрасываем имя файла
  };

  // Изменение категории рецепта
  const handleChangeCategory = e => setCategory(e.target.value);

  // Добавление новой строки ингридиенты клавишей 'Enter'
  const handleKeyDownAddItemIngridient = e => {
    if (e.key === 'Enter') handleAddInggedient();
  };

  // Добавление новой строки шаг клавишей 'Enter'
  const handleKeyDownAddItemStep = e => {
    if (e.key === 'Enter') handleAddSteps();
  };

  // Добавление нового ингридиента
  const handleAddInggedient = () => {
    setIngredientList([...ingredientList, { id: timestamp, i_name: '', i_weight: '' }]);
  };

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
  const handleIngredientDelete = id => {
    setIngredientList(prevList => prevList.filter(item => item.id !== id));
  };

  // -------------------------------------------------------------------------------------

  const handleAddSteps = () => {
    setStepsList([...stepsList, { step: timestamp, text: '', img: null, imgDB: null, imgName: null }]);
  };

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
      const sanitizedName = selectedFiles[0].name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      newFileName = `${timestamp}_${sanitizedName}`;
      urlImgInDB = `/recipe/${timestamp}_${sanitizedName}`;
      // Создаем новый файл с новым именем через Blob
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
              : { ...item, img: previewUrl, imgDB: renamedFile, imgName: urlImgInDB }
            : item
        )
      );
    });
  };

  //  ~ Удаление выбранного изображения из шага
  const handleDeleteImage = id => {
    setStepsList(prevList => {
      return prevList.map(item => (item.step === id ? { ...item, img: null, imgDB: null, imgName: null } : item));
    });
  };
  //  ~ Удаление выбранного шага
  const handleStepsDelete = id => {
    setStepsList(prevList => prevList.filter(item => item.step !== id));
  };

  useEffect(() => {
    if (statusAddRecipe && !loadingUploadFiles) navigate('/recipes');
  }, [dispatch, loadingUploadFiles, navigate, statusAddRecipe]);

  const handleSave = () => {
    const recipe = {
      name: name,
      img: img ? img : null,
      category: category,
      ingredients: ingredientList
        .map(i => {
          return i.i_name !== '' || i.i_weight !== '' ? { i_name: i.i_name, i_weight: i.i_weight } : null;
        })
        .filter(item => item !== null),
      steps: stepsList
        .map((i, index) => {
          return i.text !== '' || i.img !== null
            ? { step: index + 1, text: i.text, img: i.imgName ? i.imgName : null }
            : null;
        })
        .filter(item => item !== null),
    };
    const formData = new FormData();
    file && formData.append('files', file); // Один файл
    stepsList.forEach(file => {
      file.imgDB && formData.append('files', file.imgDB); // Массив файлов
    });

    formData.getAll('files').length > 0 &&
      dispatch(
        authOperations.uploadFiles(formData, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        })
      );

    dispatch(recipeOperations.addRecipe(recipe));
  };

  // Редирект после отмены сохранения
  const handleCancel = () => navigate(`/recipes`);

  return (
    <div className="container-recipe-add">
      {/* <h2 className="main-title">Добавление нового рецепта</h2> */}
      <div className="header">
        <Breadcrumbs aria-label="breadcrumb">
          <Link sx={{ display: 'flex', alignItems: 'center' }} to="/recipes">
            <FastfoodIcon sx={{ mr: 0.5 }} />
            Рецепты
          </Link>

          <Typography sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
            Обновление рецепта
          </Typography>
        </Breadcrumbs>
        <div className="header__btn-block">
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
              img={previewUrl}
              onDeleteImage={handleDeleteMainImage}
              onFileChange={handleFileChange}
            />

            <div className="description__input-block">
              <TextField
                sx={{ width: '100%', marginBottom: '16px', paddingBottom: '19px' }}
                id="name"
                label="Название рецепта"
                onChange={e => setName(e.target.value)}
                type="text"
                multiline
                rows={3}
              />
              <FormControl fullWidth sx={{ width: '100%' }}>
                <InputLabel id="category-select-label">Категория</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
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
                    sx={{ width: '400px', marginRight: '12px' }}
                    id={`i_name-${i.id}`}
                    label="Название"
                    onChange={handleIngredientName}
                    autoFocus={index === ingredientList.length - 1 ? true : false}
                  />
                  <TextField
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
                <div key={i.id} className="step__item">
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
                        sx={{ width: '400px', marginLeft: '12px' }}
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
      <Backdrop
        sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loadingAddRecipe || loadingUploadFiles}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
