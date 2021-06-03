import React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

/*
* Load main screen
*/
ReactDOM.render(
    (<React.Fragment>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <h1>Hello World</h1>
        </MuiPickersUtilsProvider>
    </React.Fragment>)
    ,
    document.getElementById('container')
);

