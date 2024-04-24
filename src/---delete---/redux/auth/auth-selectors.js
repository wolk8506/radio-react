const getIsLoggedIn = state => state.auth.isLoggedIn;
const getCode = state => state.auth.isCode;
const getUsername = state => state.auth.user.name;
const getIsFetchingCurrent = state => state.auth.isFetchingCurrentUser;
const getAvatar = state => state.auth.user.avatarURL;

const authSelectors = {
  getIsLoggedIn,
  getUsername,
  getIsFetchingCurrent,
  getAvatar,
  getCode,
};
export default authSelectors;
