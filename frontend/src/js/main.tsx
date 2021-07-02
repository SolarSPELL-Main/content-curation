import React, { useEffect } from "react";
import Button from '@material-ui/core/Button';
import Tabs from './tabs';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { fetch_user } from "./state/global"
import Snackbar from '@material-ui/core/Snackbar';
import { useCCDispatch, useCCSelector } from './hooks';


/*
 * Main entry point of the application
 */
function Main(): React.ReactElement {
    const dispatch = useCCDispatch();
    const open = useCCSelector(state => state.global.toast_open);
    const message = useCCSelector(state => state.global.toast_message)

    useEffect(() => {
        dispatch(fetch_user())
    }, [dispatch])

    return (<>
        <Tabs />
        <Snackbar anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        message={message}
        action={
            <React.Fragment>
              <Button color="secondary" size="small">
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit">
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
        }/>
    </>);
}

export default Main;
