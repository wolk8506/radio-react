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
      state.token = 'sgasgaasg.sgasgdagas.asgagadfh';
      state.isLoggedIn = false;
      state.isCode = action.code;
    })
    .addCase(updateRecipeFavoriteById.fulfilled, (state, action) => {
      state.user = action.payload;
    })
    .addCase(logIn.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    })
    .addCase(logOut.fulfilled, (state, action) => {
      state.user = { name: null, email: null };
      state.token = null;
      state.isLoggedIn = false;
    })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
      if (action.payload.status === 401) {
        state.token = action.payload.token;
      }

      state.user = action.payload;
      state.isLoggedIn = true;
      state.isFetchingCurrentUser = false;
    })
    // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
    //   state.isFetchingCurrentUser = false;
    // })
    // -------------------------------------------------------
    .addCase(updateAvatar.fulfilled, (state, action) => {
      state.user.avatarURL = action.payload.avatarURL;
      state.isFetchingUploadAvatar = false;
    })
    .addCase(updateAvatar.pending, (state, action) => {
      state.isFetchingUploadAvatar = true;
    })
    // .addCase(updateAvatar.fulfilled, (state, action) => {
    //   state.isFetchingUploadAvatar = false;
    // })
    .addCase(updateAvatar.rejected, (state, action) => {
      state.isFetchingUploadAvatar = false;
    })
    // -------------------------------------------------------
    .addCase(updateName.fulfilled, (state, action) => {
      state.user = action.payload.data;
    })
    .addCase(updateEmail.fulfilled, (state, action) => {
      state.user = action.payload.data;
    });
});
