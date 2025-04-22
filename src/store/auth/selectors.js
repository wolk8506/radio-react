export const getIsLoggedIn = state => state.auth.isLoggedIn;
export const getIsFetchingUploadAvatar = state => state.auth.isFetchingUploadAvatar;
export const getCode = state => state.auth.isCode;
export const getUsername = state => state.auth.user.name;
export const getIsFetchingCurrent = state => state.auth.isFetchingCurrentUser;
export const getAvatar = state => state.auth.user.avatarURL;
export const getCreatedAt = state => state.auth.user.createdAt;
export const getEmail = state => state.auth.user.email;
export const getUserID = state => state.auth.user._id;

export const authSelectors = {
  getIsLoggedIn,
  getUsername,
  getIsFetchingCurrent,
  getAvatar,
  getCode,
};
// export default authSelectors;
