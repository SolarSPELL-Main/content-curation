//Importing from outside the project
import React, { useEffect } from "react";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

//Importing from other files in the project
import Tabs from './tabs';
import { fetch_user } from "./state/global"
import { useCCDispatch, useCCSelector } from './hooks';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/*
 * Main entry point of the application
 */
function Main(): React.ReactElement {
    const dispatch = useCCDispatch();
    const open = useCCSelector(state => state.global.toast_open);
    const message = useCCSelector(state => state.global.toast_message);
    const severity = useCCSelector(state => state.global.toast_severity);

    useEffect(() => {
        dispatch(fetch_user())
    }, [dispatch])

    return (<>
        <Tabs />
        <Snackbar anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}>
          <React.Fragment >
            <Alert severity={severity} > {message}
              <IconButton size="small" aria-label="close" color="inherit" >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Alert>
          </React.Fragment>
        </Snackbar>
    </>);
}

export default Main;