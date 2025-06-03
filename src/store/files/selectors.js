const getLoadingUploadFiles = state => state.files.loadingUploadFiles;
const getLoadingUploadWalpaper = state => state.files.loadingUploadWalpaper;
const getStatusUploadWalpaper = state => state.files.statusUploadWalpaper;

export const fileSelector = { getLoadingUploadFiles, getLoadingUploadWalpaper, getStatusUploadWalpaper };
