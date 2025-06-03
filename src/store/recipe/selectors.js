const getRecipe = state => state.recipe.recipe;
const getRecipeCategories = state => state.recipe.recipeCategories;
const getLoadingAddRecipe = state => state.recipe.loadingAddRecipe;
const getStatusAddRecipe = state => state.recipe.statusAddRecipe;
const getLoadingDeleteRecipe = state => state.recipe.loadingDeleteRecipe;
const getStatusDeleteRecipe = state => state.recipe.statusDeleteRecipe;
const getLoadingUpdateRecipe = state => state.recipe.loadingUpdateRecipe;
const getStatusUpdateRecipe = state => state.recipe.statusUpdateRecipe;

export const recipeSelectors = {
  getRecipe,
  getRecipeCategories,
  getLoadingAddRecipe,
  getStatusAddRecipe,
  getLoadingDeleteRecipe,
  getStatusDeleteRecipe,
  getLoadingUpdateRecipe,
  getStatusUpdateRecipe,
};
