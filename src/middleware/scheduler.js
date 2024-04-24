export const sheduler = store => next => action => {
  const delayMs = action?.meta?.delayMs;
  if (!delayMs) {
    return next(action);
  }

  const timeoutID = setTimeout(() => next(action), delayMs);

  return () => {
    console.log('===> cancelled');
    clearTimeout(timeoutID);
  };
};
