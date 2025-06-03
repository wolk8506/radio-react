const getIsFetchingUploadAvatar = state => state.auth.isFetchingUploadAvatar;
const getIsLoggedIn = state => state.auth.isLoggedIn;
const getIsFetchingCurrent = state => state.auth.isFetchingCurrentUser;
const getUsername = state => state.auth.user.name;
const getAvatar = state => state.auth.user?.avatarURL;
const getWalpaperURL = state => state.auth.user.walpaperURL;
const getCreatedAt = state => state.auth.user.createdAt;
const getEmail = state => state.auth.user.email;
const getUserID = state => state.auth.user._id;
const getFavorites = state => state.auth.user.favorites;
const getSubscription = state => state.auth.user.subscription; // Добавлено поле для согласованности
const getIsFetchingUpdateName = state => state.auth.isFetchingUpdateName; // Добавлено поле для согласованности
const getIsFetchingUpdateEmail = state => state.auth.isFetchingUpdateEmail; // Добавлено поле для согласованности
const getIsFetchingUpdatePassword = state => state.auth.isFetchingUpdatePassword; // Добавлено поле для согласованности

export const authSelectors = {
  getIsLoggedIn,
  getIsFetchingCurrent,
  getUsername,
  getAvatar,
  getWalpaperURL,
  getCreatedAt,
  getEmail,
  getUserID,
  getFavorites,
  getSubscription,
  getIsFetchingUpdateName,
  getIsFetchingUploadAvatar,
  getIsFetchingUpdateEmail,
  getIsFetchingUpdatePassword,
};
