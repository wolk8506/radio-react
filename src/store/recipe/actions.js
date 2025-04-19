import { createAction } from '@reduxjs/toolkit';
// import { nanoid } from 'nanoid';

export const setStatusAddRecipe = createAction('recipe/loadingAddRecipe');
export const setStatusDeleteRecipe = createAction('recipe/loadingDeleteRecipe');
export const setStatusUpdateRecipe = createAction('recipe/loadingUpdateRecipe');
