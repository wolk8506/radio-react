import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from 'App';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store, { persistor } from './store/store';
import { rootSelectors } from 'store';
import { createAppTheme } from './theme';

import './index.scss';

// MUI-тема пересобирается при смене активной темы приложения (themeChengeTheme в redux),
// т.к. держать var() в палитре MUI нельзя — внутренние alpha()/lighten() падают.
const MuiThemeBridge = ({ children }) => {
  const themeName = useSelector(rootSelectors.getThemeChengeTheme);
  const muiTheme = useMemo(() => createAppTheme(themeName), [themeName]);
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MuiThemeBridge>
          <BrowserRouter basename="radio-react/">
            <App />
          </BrowserRouter>
        </MuiThemeBridge>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
