const getTimers = state => state.timer.timers;
const getTimersLoading = state => state.timer.loading;

export const timerSelectors = {
  getTimers,
  getTimersLoading,
};