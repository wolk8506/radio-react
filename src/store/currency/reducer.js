import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { currencyActions, currencyOperations } from 'store';

import {
  initStateCurrencyMono,
  initStateNBU,
  initStateCurrencyZVR,
  initStateCurrencyYesterday,
} from './init-state-mock';

import moment from 'moment';

const initState_CurrencyMonoCurrent = {
  data: initStateCurrencyMono,
  loading: false,
  status: true,
  timeUpdate: '----.--.-- --:--:--',
};

const initState_NBU = {
  data: initStateNBU,
  loading: false,
  status: true,
  timeUpdate: '----.--.-- --:--:--',
};

const initState_ZVR = {
  data: initStateCurrencyZVR,
  loading: false,
  status: true,
  timeUpdate: '----.--.-- --:--:--',
};

const currencyMono = createReducer(initState_CurrencyMonoCurrent, builder => {
  builder
    .addCase(currencyOperations.fetchCurrencyMonoCurrent.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.timeUpdate = moment().format('YYYY.MM.DD HH:mm:ss');
    })
    .addCase(currencyOperations.fetchCurrencyMonoCurrent.pending, (state, action) => {
      state.loading = true;
      state.status = false;
    })
    .addCase(currencyOperations.fetchCurrencyMonoCurrent.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
    });
});

const currencyNBUtoday = createReducer(initState_NBU, builder => {
  builder
    .addCase(currencyOperations.fetchCurrencyNBUtoday.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.timeUpdate = moment().format('YYYY.MM.DD HH:mm:ss');
    })
    .addCase(currencyOperations.fetchCurrencyNBUtoday.pending, (state, action) => {
      state.loading = true;
      state.status = false;
    })
    .addCase(currencyOperations.fetchCurrencyNBUtoday.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
    });
});

const currencyNBUtomorrow = createReducer(initState_NBU, builder => {
  builder
    .addCase(currencyOperations.fetchCurrencyNBUtomorrow.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.timeUpdate = moment().format('YYYY.MM.DD HH:mm:ss');
    })
    .addCase(currencyOperations.fetchCurrencyNBUtomorrow.pending, (state, action) => {
      state.loading = true;
      state.status = false;
    })
    .addCase(currencyOperations.fetchCurrencyNBUtomorrow.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
    });
});

const currencyZVRCurrent = createReducer(initState_ZVR, builder => {
  builder
    .addCase(currencyOperations.fetchCurrencyZVRCurrent.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.timeUpdate = moment().format('YYYY.MM.DD HH:mm:ss');
    })
    .addCase(currencyOperations.fetchCurrencyZVRCurrent.pending, (state, action) => {
      state.loading = true;
      state.status = false;
    })
    .addCase(currencyOperations.fetchCurrencyZVRCurrent.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
    });
});

const currencyZVRPrevious = createReducer(initState_ZVR, builder => {
  builder
    .addCase(currencyOperations.fetchCurrencyZVRPrevious.fulfilled, (state, action) => {
      if (action.payload !== undefined) state.data = action.payload;
      state.loading = false;
      state.status = true;
      state.timeUpdate = moment().format('YYYY.MM.DD HH:mm:ss');
    })
    .addCase(currencyOperations.fetchCurrencyZVRPrevious.pending, (state, action) => {
      state.loading = true;
      state.status = false;
    })
    .addCase(currencyOperations.fetchCurrencyZVRPrevious.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
    });
});

const currencyYesterday = createReducer(initStateCurrencyYesterday, builder => {
  builder.addCase(currencyActions.setCurrencyYesterday, (state, action) => action.payload);
});

export default combineReducers({
  currencyMono,
  currencyNBUtoday,
  currencyNBUtomorrow,
  currencyZVRCurrent,
  currencyZVRPrevious,
  currencyYesterday,
});
