import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { uploadFiles } from './operations';

const loadingUploadFiles = createReducer(false, builder => {
  builder

    .addCase(uploadFiles.pending, () => true)
    .addCase(uploadFiles.fulfilled, () => false)
    .addCase(uploadFiles.rejected, () => false);
});

export default combineReducers({
  loadingUploadFiles,
});
