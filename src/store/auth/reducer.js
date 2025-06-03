import { createReducer } from '@reduxjs/toolkit';
import { authOperations } from './operations';

const initState = {
  user: { name: null, email: null, avatarURL: null, walpaperURL: null, createdAt: null },
  token: null,
  isLoggedIn: false,
  isFetchingCurrentUser: false,
  isVeryfy: false,
  isCode: null,
  isFetchingUploadAvatar: false,
  isFetchingUpdateName: false,
  isFetchingUpdateEmail: false,
};

const auth = createReducer(initState, builder => {
  builder
    .addCase(authOperations.register.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      state.token = action.payload.token;
      localStorage.setItem('authToken', action.payload.token);
      state.isLoggedIn = false;
      state.isCode = action.payload.code;
    })
    .addCase(authOperations.logIn.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      localStorage.setItem('authToken', action.payload.token);
    })
    .addCase(authOperations.logOut.fulfilled, state => {
      state.user = { name: null, email: null, avatarURL: null };
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('authToken');
    })

    .addCase(authOperations.fetchCurrentUser.pending, state => {
      state.isFetchingCurrentUser = true;
    })
    .addCase(authOperations.fetchCurrentUser.fulfilled, (state, action) => {
      if (action.payload?.status === 401) {
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem('authToken');
      } else {
        state.user = action.payload;
        state.isFetchingCurrentUser = false;
        state.isLoggedIn = true;
      }
    })
    .addCase(authOperations.fetchCurrentUser.rejected, state => {
      state.isFetchingCurrentUser = false;
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem('authToken');
    })
    // ~  updateAvatar
    .addCase(authOperations.updateAvatar.fulfilled, (state, action) => {
      state.user.avatarURL = action.payload.avatarURL;
      state.isFetchingUploadAvatar = false;
    })
    .addCase(authOperations.updateAvatar.pending, state => {
      state.isFetchingUploadAvatar = true;
    })
    .addCase(authOperations.updateAvatar.rejected, state => {
      state.isFetchingUploadAvatar = false;
    })
    // ~  updateName
    .addCase(authOperations.updateName.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.isFetchingUpdateName = false;
    })
    .addCase(authOperations.updateName.pending, (state, action) => {
      state.isFetchingUpdateName = true;
    })
    .addCase(authOperations.updateName.rejected, (state, action) => {
      state.isFetchingUpdateName = false;
    })
    // ~  updateEmail
    .addCase(authOperations.updateEmail.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.isFetchingUpdateEmail = false;
    })
    .addCase(authOperations.updateEmail.pending, (state, action) => {
      state.isFetchingUpdateEmail = true;
    })
    .addCase(authOperations.updateEmail.rejected, (state, action) => {
      state.isFetchingUpdateEmail = false;
    })
    // ~  updatePassword
    .addCase(authOperations.changePassword.fulfilled, (state, action) => {
      state.isFetchingUpdatePassword = false;
    })
    .addCase(authOperations.changePassword.pending, (state, action) => {
      state.isFetchingUpdatePassword = true;
    })
    .addCase(authOperations.changePassword.rejected, (state, action) => {
      state.isFetchingUpdatePassword = false;
    })
    // ~
    .addCase(authOperations.updateRecipeFavoriteById.fulfilled, (state, action) => {
      state.user = action.payload;
    });
});

export const authReducer = auth;
