import React, { useEffect } from "react";
import Tabs from './tabs';
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
        <Snackbar open={open} message={message} />
    </>);
}

export default Main;
