import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { fileOperations, fileActions } from 'store';

const loadingUploadFiles = createReducer(false, builder => {
  builder
    .addCase(fileOperations.uploadFiles.pending, () => true)
    .addCase(fileOperations.uploadFiles.fulfilled, () => false)
    .addCase(fileOperations.uploadFiles.rejected, () => false);
});

const loadingUploadWalpaper = createReducer(false, builder => {
  builder
    .addCase(fileOperations.uploadWalpaper.pending, () => true)
    .addCase(fileOperations.uploadWalpaper.fulfilled, () => false)
    .addCase(fileOperations.uploadWalpaper.rejected, () => false);
});

const statusUploadWalpaper = createReducer(false, builder => {
  builder
    .addCase(fileOperations.uploadWalpaper.pending, () => false)
    .addCase(fileOperations.uploadWalpaper.fulfilled, () => true)
    .addCase(fileOperations.uploadWalpaper.rejected, () => false)
    .addCase(fileActions.setStatusUploadWalpaper, () => false);
});

export default combineReducers({
  loadingUploadFiles,
  loadingUploadWalpaper,
  statusUploadWalpaper,
});
