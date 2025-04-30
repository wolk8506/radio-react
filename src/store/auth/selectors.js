export const getIsFetchingUploadAvatar = state => state.auth.isFetchingUploadAvatar;
export const getIsLoggedIn = state => state.auth.isLoggedIn;
export const getIsFetchingCurrent = state => state.auth.isFetchingCurrentUser;
export const getUsername = state => state.auth.user.name;
export const getAvatar = state => state.auth.user.avatarURL;
export const getCreatedAt = state => state.auth.user.createdAt;
export const getEmail = state => state.auth.user.email;
export const getUserID = state => state.auth.user._id;
export const getFavorites = state => state.auth.user.favorites;
export const getSubscription = state => state.auth.user.subscription; // Добавлено поле для согласованности

export const authSelectors = {
  getIsLoggedIn,
  getIsFetchingCurrent,
  getUsername,
  getAvatar,
  getCreatedAt,
  getEmail,
  getUserID,
  getFavorites,
  getSubscription,
};
