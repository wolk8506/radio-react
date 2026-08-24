import { createAsyncThunk } from '@reduxjs/toolkit';

const STORAGE_KEY = 'user_timers';

export const loadTimers = createAsyncThunk('timer/loadTimers', async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
});

export const addTimer = createAsyncThunk('timer/addTimer', async (timerData, { getState, dispatch }) => {
  try {
    const state = getState();
    const currentTimers = state.timer?.timers || [];
    const newTimers = [...currentTimers, timerData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTimers));
    return newTimers;
  } catch {
    throw new Error('Failed to add timer');
  }
});

export const deleteTimer = createAsyncThunk('timer/deleteTimer', async (timerId, { getState }) => {
  try {
    const state = getState();
    const currentTimers = state.timer?.timers || [];
    const newTimers = currentTimers.filter(t => t.id !== timerId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTimers));
    return newTimers;
  } catch {
    throw new Error('Failed to delete timer');
  }
});

export const updateTimer = createAsyncThunk('timer/updateTimer', async (timerData, { getState }) => {
  try {
    const state = getState();
    const currentTimers = state.timer?.timers || [];
    const newTimers = currentTimers.map(t => t.id === timerData.id ? { ...t, ...timerData } : t);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTimers));
    return newTimers;
  } catch {
    throw new Error('Failed to update timer');
  }
});

export const timerOperations = {
  loadTimers,
  addTimer,
  deleteTimer,
  updateTimer,
};