import { createReducer } from '@reduxjs/toolkit';
import {
  register,
  logIn,
  logOut,
  fetchCurrentUser,
  updateAvatar,
  updateName,
  updateEmail,
  updateRecipeFavoriteById,
} from './operations';

const initState = {
  user: { name: null, email: null, avatarURL: null, createdAt: null },
  token: null,
  isLoggedIn: false,
  isFetchingCurrentUser: false,
  isVeryfy: false,
  isCode: null,
  isFetchingUploadAvatar: false,
};

export const auth = createReducer(initState, builder => {
  builder
    .addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      state.token = action.payload.token;
      localStorage.setItem('authToken', action.payload.token);
      state.isLoggedIn = false;
      state.isCode = action.payload.code;
    })
    .addCase(logIn.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      localStorage.setItem('authToken', action.payload.token);
    })
    .addCase(logOut.fulfilled, state => {
      state.user = { name: null, email: null, avatarURL: null };
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('authToken');
    })

    .addCase(fetchCurrentUser.pending, state => {
      state.isFetchingCurrentUser = true;
    })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
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
    .addCase(fetchCurrentUser.rejected, state => {
      state.isFetchingCurrentUser = false;
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem('authToken');
    })
    .addCase(updateAvatar.fulfilled, (state, action) => {
      state.user.avatarURL = action.payload.avatarURL;
      state.isFetchingUploadAvatar = false;
    })
    .addCase(updateAvatar.pending, state => {
      state.isFetchingUploadAvatar = true;
    })
    .addCase(updateAvatar.rejected, state => {
      state.isFetchingUploadAvatar = false;
    })
    .addCase(updateName.fulfilled, (state, action) => {
      state.user = action.payload.data;
    })
    .addCase(updateEmail.fulfilled, (state, action) => {
      state.user = action.payload.data;
    })
    .addCase(updateRecipeFavoriteById.fulfilled, (state, action) => {
      state.user = action.payload;
    });
});
