//Importing from outside the project
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { SnackbarProvider } from 'notistack'

//Importing from other files in the project
import store from './state/store'
import Main from './main'
import './styles.css';

/*
* Load main screen
*/
ReactDOM.render(
    (<Provider store={store}>
        <SnackbarProvider>
            <HashRouter>
                <CssBaseline />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Main />
                </MuiPickersUtilsProvider>
            </HashRouter>
        </SnackbarProvider>
    </Provider>),
    document.getElementById('container')
);
