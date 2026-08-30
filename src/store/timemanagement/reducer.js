import { createReducer } from '@reduxjs/toolkit';
import { fetchTimeManagement, saveTimeManagement } from './operations';

const initialState = {
  tasks: [],
  plans: [],
  loading: false,
  saving: false,
  error: null,
  loaded: false,
};

export const timeManagementReducer = createReducer(initialState, builder => {
  builder
    .addCase(fetchTimeManagement.pending, state => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTimeManagement.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload.tasks || [];
      state.plans = action.payload.plans || [];
      state.loaded = true;
    })
    .addCase(fetchTimeManagement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.loaded = true;
    })
    .addCase(saveTimeManagement.pending, state => {
      state.saving = true;
    })
    .addCase(saveTimeManagement.fulfilled, (state, action) => {
      state.saving = false;
      state.tasks = action.payload.tasks;
      state.plans = action.payload.plans;
    })
    .addCase(saveTimeManagement.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload;
    });
});