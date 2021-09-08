import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MuiThemeProvider } from '@material-ui/core/styles';

import DateFnsUtils from '@date-io/date-fns';
import { SnackbarProvider } from 'notistack';

import store from './state/store';
import Main from './main';
import './styles.css';
import theme from './theme';


/*
* Load main screen
*/
ReactDOM.render(
  (<Provider store={store}>
    <SnackbarProvider>
      <HashRouter>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={theme}>
            <Main />
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </HashRouter>
    </SnackbarProvider>
  </Provider>),
  document.getElementById('container')
);
