import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import store from './state/store'
import { Provider } from 'react-redux'

import Main from './main'

/*
* Load main screen
*/
ReactDOM.render(
    (<Provider store={store}>
        <HashRouter>
            <CssBaseline />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Main />
            </MuiPickersUtilsProvider>
        </HashRouter>
    </Provider>),
    document.getElementById('container')
);
