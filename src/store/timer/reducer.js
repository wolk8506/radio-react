import { createReducer } from '@reduxjs/toolkit';
import { timerOperations } from './operation';

const timerState = createReducer(
  { timers: [], loading: false },
  (builder) => {
    builder
      .addCase(timerOperations.loadTimers.pending, (state) => {
        state.loading = true;
      })
      .addCase(timerOperations.loadTimers.fulfilled, (state, action) => {
        state.loading = false;
        state.timers = action.payload;
      })
      .addCase(timerOperations.loadTimers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(timerOperations.addTimer.fulfilled, (state, action) => {
        state.timers = action.payload;
      })
      .addCase(timerOperations.deleteTimer.fulfilled, (state, action) => {
        state.timers = action.payload;
      })
      .addCase(timerOperations.updateTimer.fulfilled, (state, action) => {
        state.timers = action.payload;
      });
  }
);

export default timerState;