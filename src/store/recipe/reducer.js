import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { authOperations, recipeOperations, recipeActions } from 'store';

const recipe = createReducer([], builder => {
  builder
    .addCase(recipeOperations.fetchRecipe.fulfilled, (state, action) => action.payload)
    .addCase(recipeOperations.addRecipe.fulfilled, (state, action) => [...state, action.payload])
    .addCase(authOperations.updateRecipeFavoriteById.fulfilled, (state, action) =>
      state.forEach(function (element) {
        if (element._id === action.payload._id) {
          element.favorite = action.payload.favorite;
        }
      })
    )
    .addCase(recipeOperations.updateRecipe.fulfilled, (state, action) => {
      return state.map(element => {
        if (element._id === action.payload._id) {
          return { ...element, ...action.payload }; // Создаем новый объект вместо мутации
        }
        return element;
      });
    })
    .addCase(recipeOperations.deleteRecipe.fulfilled, (state, action) =>
      state.filter(({ _id }) => _id !== action.meta.arg)
    );
});

const recipeCategories = createReducer(false, builder => {
  builder.addCase(recipeOperations.fetchCategories.fulfilled, (state, action) => action.payload);
});

const loadingAddRecipe = createReducer(false, builder => {
  builder

    .addCase(recipeOperations.addRecipe.pending, () => true)
    .addCase(recipeOperations.addRecipe.fulfilled, () => false)
    .addCase(recipeOperations.addRecipe.rejected, () => false);
});

const statusAddRecipe = createReducer(false, builder => {
  builder

    .addCase(recipeOperations.addRecipe.pending, () => false)
    .addCase(recipeOperations.addRecipe.fulfilled, () => true)
    .addCase(recipeOperations.addRecipe.rejected, () => false)
    .addCase(recipeActions.setStatusAddRecipe, () => false);
});

const loadingDeleteRecipe = createReducer(false, builder => {
  builder

    .addCase(recipeOperations.deleteRecipe.pending, () => true)
    .addCase(recipeOperations.deleteRecipe.fulfilled, () => false)
    .addCase(recipeOperations.deleteRecipe.rejected, () => false);
});

const statusDeleteRecipe = createReducer(false, builder => {
  builder

    .addCase(recipeOperations.deleteRecipe.pending, () => false)
    .addCase(recipeOperations.deleteRecipe.fulfilled, () => true)
    .addCase(recipeOperations.deleteRecipe.rejected, () => false)
    .addCase(recipeActions.setStatusDeleteRecipe, () => false);
});

const loadingUpdateRecipe = createReducer(false, builder => {
  builder

    .addCase(recipeOperations.updateRecipe.pending, () => true)
    .addCase(recipeOperations.updateRecipe.fulfilled, () => false)
    .addCase(recipeOperations.updateRecipe.rejected, () => false);
});

const statusUpdateRecipe = createReducer(false, builder => {
  builder

    .addCase(recipeOperations.updateRecipe.pending, () => false)
    .addCase(recipeOperations.updateRecipe.fulfilled, () => true)
    .addCase(recipeOperations.updateRecipe.rejected, () => false)
    .addCase(recipeActions.setStatusUpdateRecipe, () => false);
});

export default combineReducers({
  recipe,
  recipeCategories,
  loadingAddRecipe,
  statusAddRecipe,
  loadingDeleteRecipe,
  statusDeleteRecipe,
  loadingUpdateRecipe,
  statusUpdateRecipe,
});
