import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fetchRecipe, addRecipe, deleteRecipe, favoriteRecipe, updateRecipe } from './operations';
import { setStatusAddRecipe, setStatusDeleteRecipe, setStatusUpdateRecipe } from './actions';

const recipe = createReducer([], builder => {
  builder
    .addCase(fetchRecipe.fulfilled, (state, action) => action.payload)
    .addCase(addRecipe.fulfilled, (state, action) => [...state, action.payload])
    .addCase(favoriteRecipe.fulfilled, (state, action) =>
      state.forEach(function (element) {
        if (element._id === action.payload._id) {
          element.favorite = action.payload.favorite;
        }
      })
    )
    .addCase(updateRecipe.fulfilled, (state, action) => {
      return state.map(element => {
        if (element._id === action.payload._id) {
          return { ...element, ...action.payload }; // Создаем новый объект вместо мутации
        }
        return element;
      });
    })
    .addCase(deleteRecipe.fulfilled, (state, action) => state.filter(({ _id }) => _id !== action.meta.arg));
});

const loadingAddRecipe = createReducer(false, builder => {
  builder

    .addCase(addRecipe.pending, () => true)
    .addCase(addRecipe.fulfilled, () => false)
    .addCase(addRecipe.rejected, () => false);
});

const statusAddRecipe = createReducer(false, builder => {
  builder

    .addCase(addRecipe.pending, () => false)
    .addCase(addRecipe.fulfilled, () => true)
    .addCase(addRecipe.rejected, () => false)
    .addCase(setStatusAddRecipe, () => false);
});

const loadingDeleteRecipe = createReducer(false, builder => {
  builder

    .addCase(deleteRecipe.pending, () => true)
    .addCase(deleteRecipe.fulfilled, () => false)
    .addCase(deleteRecipe.rejected, () => false);
});

const statusDeleteRecipe = createReducer(false, builder => {
  builder

    .addCase(deleteRecipe.pending, () => false)
    .addCase(deleteRecipe.fulfilled, () => true)
    .addCase(deleteRecipe.rejected, () => false)
    .addCase(setStatusDeleteRecipe, () => false);
});

const loadingUpdateRecipe = createReducer(false, builder => {
  builder

    .addCase(updateRecipe.pending, () => true)
    .addCase(updateRecipe.fulfilled, () => false)
    .addCase(updateRecipe.rejected, () => false);
});

const statusUpdateRecipe = createReducer(false, builder => {
  builder

    .addCase(updateRecipe.pending, () => false)
    .addCase(updateRecipe.fulfilled, () => true)
    .addCase(updateRecipe.rejected, () => false)
    .addCase(setStatusUpdateRecipe, () => false);
});

export default combineReducers({
  recipe,
  loadingAddRecipe,
  statusAddRecipe,
  loadingDeleteRecipe,
  statusDeleteRecipe,
  loadingUpdateRecipe,
  statusUpdateRecipe,
});
