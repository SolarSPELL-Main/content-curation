//Importing from outside the project
import React, { useEffect } from "react";
import { useSnackbar } from "notistack"

//Importing from other files in the project
import Tabs from './tabs';
import { fetch_user } from "./state/global"
import { useCCDispatch, useCCSelector, usePrevious } from './hooks';

/*
 * Main entry point of the application
 */
function Main(): React.ReactElement {
    const dispatch = useCCDispatch();
    const toasts = useCCSelector(state => state.global.toasts)
    const prevToasts = usePrevious(toasts)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    useEffect(() => {
        const new_toasts = prevToasts == null ? 
            [] :
            toasts.filter(toast =>
                prevToasts.every(lastToast => lastToast.key !== toast.key)
            )

        new_toasts.forEach(toast => enqueueSnackbar(
            toast.message,
            {
                variant: toast.severity,
                // Errors should be dismissed by hand
                persist: toast.severity === 'error',
            }
        ))

        if (prevToasts != null) {
            const old_toasts = prevToasts.filter(toast =>
                toasts.every(lastToast => lastToast.key !== toast.key)
            )
            old_toasts.forEach(toast => closeSnackbar(toast.key))
        }

    }, [toasts, prevToasts])

    useEffect(() => {
        dispatch(fetch_user())
    }, [dispatch])

    return <Tabs />
}

export default Main;
