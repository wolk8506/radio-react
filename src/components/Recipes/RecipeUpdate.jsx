import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

import { updateRecipe } from 'store/recipe/operations';
import { getLoadingUpdateRecipe, getRecipe, getStatusUpdateRecipe } from 'store/recipe/selectors';
import { setStatusUpdateRecipe } from 'store/recipe/actions';

export const RecipeUpdate = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const dataRecipe = useSelector(getRecipe);
  const loadingUpdateRecipe = useSelector(getLoadingUpdateRecipe);
  const statusUpdateRecipe = useSelector(getStatusUpdateRecipe);

  const item_ID = location.pathname.split('/')[2];
  const _ID = location.pathname.split('/')[3];
  const categoryName = [
    { name: 'Первые блюда', category: 'soup', key: 0 },
    { name: 'Вторые блюда', category: 'meat', key: 1 },
    { name: 'Салаты', category: 'salad', key: 2 },
    { name: 'Закуски', category: 'zakuski', key: 3 },
    { name: 'Выпечка', category: 'cake', key: 4 },
    { name: 'Десерты', category: 'desert', key: 5 },
    { name: 'Коктейли', category: 'cocktail', key: 6 },
    { name: 'Соусы', category: 'sousy', key: 7 },
    { name: 'Заготовки на зиму', svgId: 'zagotovki', key: 8 },
  ];
  const [recipe, setRecipe] = useState([]);
  const [name, setName] = useState();
  const [img, setImg] = useState();
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([{ id: 0 }]);
  const [ingredientsCount, setIngredientsCount] = useState(0);
  const [ingredientList, setIngredientList] = useState([]);
  const [steps, setSteps] = useState([{ id: 0 }]);
  const [stepsCount, setStepsCount] = useState(0);
  const [stepsList, setStepsList] = useState([]);

  // Поиск рецепта для редактирования
  useEffect(() => {
    if (dataRecipe.lenght !== 0) {
      const dataFilter = dataRecipe.find(c => c._id === _ID);
      if (dataFilter?.lenght !== 0) if (dataFilter) setRecipe(dataFilter);
    }
  }, [_ID, dataRecipe]);

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
    const index = ingredientsCount + 1;
    setIngredients([...ingredients, { id: index }]);
    setIngredientsCount(index);
  };

  // Запись данных ингридиенты рецепта
  const handleIngredientName = e => {
    const id = Number(e.target.id.split('-')[1]);
    const itemName = e.target.id.split('-')[0];
    const itemValue = e.target.value;
    setIngredientList(prevList => {
      const exists = prevList.some(item => item.id === id);
      return exists
        ? prevList.map(item =>
            item.id === id
              ? itemName === 'i_name'
                ? { ...item, i_name: itemValue }
                : { ...item, i_weight: itemValue }
              : item
          )
        : [
            ...prevList,
            itemName === 'i_name' ? { id, i_name: itemValue, i_weight: '' } : { id, i_name: '', i_weight: itemValue },
          ];
    });
  };

  // Удаление строки ингридиента
  const handleIngredientDelete = id => {
    setIngredientList(prevList => prevList.filter(item => item.id !== id));
    setIngredients(prevList => prevList.filter(item => item.id !== id));
  };

  // Добавление шага приготовления
  const handleAddSteps = () => {
    const index = stepsCount + 1;
    setSteps([...steps, { id: index }]);
    setStepsCount(index);
  };

  // Запись данных шаги рецепта
  const handleStepsName = e => {
    const id = Number(e.target.id.split('-')[1]);
    const itemName = e.target.id.split('-')[0];
    const itemValue = e.target.value;

    setStepsList(prevList => {
      const exists = prevList.some(item => item.step === id);
      return exists
        ? prevList.map(item =>
            item.step === id ? (itemName === 'text' ? { ...item, text: itemValue } : { ...item, img: itemValue }) : item
          )
        : [
            ...prevList,
            itemName === 'text' ? { step: id, text: itemValue, img: null } : { step: id, text: '', img: itemValue },
          ];
    });
  };

  // Удаление шага приготовления
  const handleStepsDelete = id => {
    setStepsList(prevList => prevList.filter(item => item.step !== id));
    setSteps(prevList => prevList.filter(item => item.id !== id));
  };

  // Запись данных из рецепта в форму для редактирования
  useEffect(() => {
    if (recipe.length === 0) return;
    setName(recipe.name);
    setImg(recipe.img);
    setCategory(recipe.category);
    setSteps(
      recipe.steps.map((i, index) => {
        return { id: index };
      })
    );
    setStepsCount(recipe.steps.length - 1);
    setStepsList(
      recipe.steps.map((i, index) => {
        return { step: index, text: i.text, img: i.img };
      })
    );
    setIngredients(
      recipe.ingredients.map((i, index) => {
        return { id: index };
      })
    );
    setIngredientsCount(recipe.ingredients.length - 1);
    setIngredientList(
      recipe.ingredients.map((i, index) => {
        return { id: index, i_name: i.i_name, i_weight: i.i_weight };
      })
    );
  }, [recipe]);

  // Подготовка и отправка массива данных на сервер
  const handleSave = () => {
    const recipe = {
      name: name,
      img: img ? img : null,
      category: category,
      ingredients: ingredientList.map(i => {
        return { i_name: i.i_name, i_weight: i.i_weight };
      }),
      steps: stepsList
        ? stepsList.map((i, index) => {
            return { step: index + 1, text: i.text, img: i.img ? i.img : null };
          })
        : { step: 1, text: null, img: null },
    };

    dispatch(updateRecipe({ _id: _ID, recipe }));
  };

  // Редирект после сохранения
  useEffect(() => {
    if (statusUpdateRecipe) navigate(`/recipes/${item_ID}/${_ID}`);
    dispatch(setStatusUpdateRecipe());
  }, [_ID, dispatch, item_ID, navigate, statusUpdateRecipe]);

  // Редирект после отмены сохранения
  const handleCancel = () => navigate(`/recipes/${item_ID}/${_ID}`);

  return (
    <div className="container-recipe-add">
      <h2>Обновление рецепта</h2>

      <div className="overflov">
        <div className="main-block">
          <h3 className="main-block__title">Название рецепта | Изображение | Категория</h3>

          <TextField
            sx={{ width: '100%', marginBottom: '12px' }}
            id="name"
            label="Название рецепта"
            onChange={e => setName(e.target.value)}
            type="text"
            value={name}
          />
          <TextField
            sx={{ width: '100%', marginBottom: '12px' }}
            id="img"
            label="url изображения рецепта"
            type="url"
            onChange={e => setImg(e.target.value)}
          />
          <FormControl fullWidth sx={{ width: '100%', marginBottom: '6px' }}>
            <InputLabel id="category-select-label">Категория</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              label="Категория"
              onChange={handleChangeCategory}
            >
              {categoryName.map(i => {
                return (
                  <MenuItem key={i.key} value={i.category}>
                    {i.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="ingredient">
          <h3 className="ingredient__title">Ингридиенты</h3>
          {ingredients.map((i, index) => {
            return (
              <div key={i.id} className="ingredient__item">
                <h5 className="item__title">Ингридиент #{index + 1}</h5>
                <div className="ingredient-item">
                  <TextField
                    sx={{ width: '400px', marginRight: '12px' }}
                    id={`i_name-${index}`}
                    value={ingredientList[index]?.i_name}
                    label="Название"
                    type="text"
                    onChange={handleIngredientName}
                    autoFocus={index === ingredients.length - 1 ? true : false}
                  />
                  <TextField
                    sx={{ width: '200px' }}
                    id={`i_weight-${index}`}
                    value={ingredientList[index]?.i_weight}
                    label="Количество"
                    onChange={handleIngredientName}
                    onKeyDown={handleKeyDownAddItemIngridient}
                  />

                  <Button onClick={() => handleIngredientDelete(i.id)} disabled={ingredients.length > 1 ? false : true}>
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
          <div className="step__item">
            {steps.map((i, index) => {
              return (
                <div key={i.id} className="step__item">
                  <h5 className="item__title">Описание приготовления шаг #{index + 1}</h5>
                  <div className="item__description-bloc">
                    <div>
                      <TextField
                        sx={{ width: '612px', marginBottom: '12px' }}
                        id={`text-${index}`}
                        value={stepsList[index]?.text}
                        label="Описание приготовления"
                        multiline
                        rows={4}
                        onChange={handleStepsName}
                        onKeyDown={handleKeyDownAddItemStep}
                        autoFocus={index === steps.length - 1 ? true : false}
                      />
                      <TextField
                        sx={{ width: '612px', marginBottom: '12px' }}
                        id={`img-${index}`}
                        value={stepsList[index]?.img}
                        label="url изображения"
                        onChange={handleStepsName}
                        onKeyDown={handleKeyDownAddItemStep}
                      />
                    </div>

                    <Button onClick={() => handleStepsDelete(i.id)} disabled={steps.length > 1 ? false : true}>
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
      <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loadingUpdateRecipe}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
