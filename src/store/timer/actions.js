import { createAction } from '@reduxjs/toolkit';

const addTimer = createAction('timer/addTimer');
const deleteTimer = createAction('timer/deleteTimer');
const setTimers = createAction('timer/setTimers');

export const timerActions = {
  addTimer,
  deleteTimer,
  setTimers,
};