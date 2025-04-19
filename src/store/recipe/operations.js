import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// axios.defaults.baseURL = 'http://localhost:8080/api';
axios.defaults.baseURL =
  'https://8080-idx-radio-react-backendgit-1745093926321.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev/api';

export const fetchRecipe = createAsyncThunk('recipe/fetchRecipe', async () => {
  const response = await axios.get('/recipe');
  return response.data.data.result;
});

export const addRecipe = createAsyncThunk('recipe/addRecipe', async data => {
  try {
    const response = await axios.post('/recipe', data);
    return response.data.data.result;
  } catch (error) {
    console.log('❌ error');
    if (error.status === 400) {
      const errorMesage = error.response.data.message.split('"')[1];
      let field = '';
      switch (errorMesage) {
        case 'name':
          field = 'Поле назавания рецепта не заполнено. Заполните поле и повторите попытку';
          break;
        case 'category':
          field = 'Категория рецепта не выбрана. Повторите выбор категории и повторите попытку';
          break;
        case 'ingredients':
          field = 'Поля ингридиентов не заполнены. Заполните поле и повторите попытку';
          break;
        case 'ingredients[0].i_weight':
          field = 'Поле с количеством ингридиента не заполнено. Заполните поле и повторите попытку';
          break;
        case 'ingredients[0].i_name':
          field = 'Поле названия ингридиента не заполнено. Заполните поле и повторите попытку';
          break;
        default:
      }
      toast.error(field, {
        position: 'top-center',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    return Promise.reject(error);
  }
});

export const deleteRecipe = createAsyncThunk('recipe/deleteRecipe', async id => {
  const response = await axios.delete(`/recipe/${id}`);
  return response.data.data.result;
});

export const favoriteRecipe = createAsyncThunk('recipe/favorite', async recipe => {
  const { _id, favorite } = recipe;
  const response = await axios.patch(`/recipe/${_id}/favorite`, {
    favorite: !favorite,
  });
  return response.data.data.result;
});

export const updateRecipe = createAsyncThunk('recipe/updateRecipe', async data => {
  try {
    const { _id, recipe } = data;
    const response = await axios.put(`/recipe/${_id}/`, recipe);
    return response.data.data.result;
  } catch (error) {
    console.log('❌ error');
    // if (error.status === 400) {
    //   const errorMesage = error.response.data.message.split('"')[1];
    //   let field = '';
    //   switch (errorMesage) {
    //     case 'name':
    //       field = 'Поле назавания рецепта не заполнено. Заполните поле и повторите попытку';
    //       break;
    //     case 'category':
    //       field = 'Категория рецепта не выбрана. Повторите выбор категории и повторите попытку';
    //       break;
    //     case 'ingredients':
    //       field = 'Поля ингридиентов не заполнены. Заполните поле и повторите попытку';
    //       break;
    //     case 'ingredients[0].i_weight':
    //       field = 'Поле с количеством ингридиента не заполнено. Заполните поле и повторите попытку';
    //       break;
    //     case 'ingredients[0].i_name':
    //       field = 'Поле названия ингридиента не заполнено. Заполните поле и повторите попытку';
    //       break;
    //     default:
    //   }
    //   toast.error(field, {
    //     position: 'top-center',
    //     autoClose: 5000,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    // }
    return Promise.reject(error);
  }
});
