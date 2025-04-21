import { createReducer } from '@reduxjs/toolkit';
import { register, logIn, logOut, fetchCurrentUser, updateAvatar, updateName, updateEmail } from './operations';

const initState = {
  user: { name: null, email: null, avatarURL: null, createdAt: null },
  token: null,
  isLoggedIn: false,
  isFetchingCurrentUser: false,
  isVeryfy: false,
  isCode: null,
};

export const auth = createReducer(initState, builder => {
  builder
    .addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.data.user;
      state.token = 'sgasgaasg.sgasgdagas.asgagadfh';
      state.isLoggedIn = false;
      state.isCode = action.code;
    })
    .addCase(logIn.fulfilled, (state, action) => {
      // console.log(action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    })
    .addCase(logOut.fulfilled, (state, action) => {
      state.user = { name: null, email: null };
      state.token = null;
      state.isLoggedIn = false;
    })
    // .addCase(fetchCurrentUser.fulfilled, (state, action) => {
    //   state.isFetchingCurrentUser = true;
    // })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => {
      // console.log(action.payload);
      // state.token = action.payload.token;
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
    .addCase(updateAvatar.fulfilled, (state, action) => {
      state.user.avatarURL = action.payload.avatarURL;
    })
    .addCase(updateName.fulfilled, (state, action) => {
      state.user = action.payload.data;
    })
    .addCase(updateEmail.fulfilled, (state, action) => {
      state.user = action.payload.data;
    });
});

// const loading = createReducer(false, builder => {
//   builder
//     .addCase(register.pending, () => true)
//     .addCase(register.fulfilled, () => false)
//     .addCase(register.rejected, () => false);
// });

// const status = createReducer(false, builder => {
//   builder
//     .addCase(register.pending, () => false)
//     .addCase(register.fulfilled, () => true)
//     .addCase(register.rejected, () => false);
// });

// const timeUpdate = createReducer('----.--.-- --:--:--', builder => {
//   builder.addCase(register.fulfilled, () => moment().format('YYYY.MM.DD HH:mm:ss'));
// });

// export default combineReducers({
//   auth,
// });
