//
export const getRecipe = state => state.recipe.recipe;
export const getLoadingAddRecipe = state => state.recipe.loadingAddRecipe;
export const getStatusAddRecipe = state => state.recipe.statusAddRecipe;
export const getLoadingDeleteRecipe = state => state.recipe.loadingDeleteRecipe;
export const getStatusDeleteRecipe = state => state.recipe.statusDeleteRecipe;
export const getLoadingUpdateRecipe = state => state.recipe.loadingUpdateRecipe;
export const getStatusUpdateRecipe = state => state.recipe.statusUpdateRecipe;

export const authSelectors = {
  getRecipe,
};
// export default authSelectors;
