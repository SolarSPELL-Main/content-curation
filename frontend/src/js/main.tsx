import React, { useEffect } from 'react';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { useSnackbar } from 'notistack';

import Loader from './Loader';
import { NavBar, PageBody, Footer } from './pages';
import { fetch_user, close_toast } from './state/global';
import { useCCDispatch, useCCSelector, usePrevious } from './hooks';

/*
 * Main entry point of the application
 */
function Main(): React.ReactElement {
  const dispatch = useCCDispatch();
    
  // Check if any async operations are occurring
  // If so, show the loader
  const requests = useCCSelector(state => state.global.outstandingRequests);
  const showLoader = requests.length > 0;

  const toasts = useCCSelector(state => state.global.toasts);
  const prevToasts = usePrevious(toasts);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    //Enqueue a snackbar for every toast that wasnt there previously
    const newToasts = prevToasts == null ? 
      [] :
      toasts.filter(toast =>
        prevToasts.every(lastToast => lastToast.key !== toast.key)
      );

    newToasts.forEach(toast => enqueueSnackbar(
      toast.message,
      {
        key: toast.key,
        variant: toast.severity,
        // Dismissal is handled by RxJs / user interaction
        autoHideDuration: null,
        action: (key: number) => (
          <IconButton
            onClick={() => dispatch(close_toast(key))}
          >
            <CloseIcon />
          </IconButton>
        ),
      }
    ));

    //Close all snackbars that were in the previous toasts but not current
    if (prevToasts != null) {
      const oldToasts = prevToasts.filter(toast =>
        toasts.every(lastToast => lastToast.key !== toast.key)
      );
      oldToasts.forEach(toast => closeSnackbar(toast.key));
    }

  }, [dispatch, toasts, prevToasts]);

  useEffect(() => {
    dispatch(fetch_user());
  }, [dispatch]);

  return (<>
    <NavBar />
    <PageBody />
    <Loader open={showLoader} />
    <Footer />
  </>);
}

export default Main;
