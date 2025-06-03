import { createAction } from '@reduxjs/toolkit';

const setStatusAddRecipe = createAction('recipe/loadingAddRecipe');
const setStatusDeleteRecipe = createAction('recipe/loadingDeleteRecipe');
const setStatusUpdateRecipe = createAction('recipe/loadingUpdateRecipe');

export const recipeActions = { setStatusAddRecipe, setStatusDeleteRecipe, setStatusUpdateRecipe };
