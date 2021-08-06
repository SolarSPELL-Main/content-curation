import React from 'react';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useCCSelector } from './hooks';

/**
 * The circular loading icon that appears in the middle of the screen during
 * API requests or other async operations.
 * It checks if the length of outstanding requests in global state is greater
 * than 0, then displays the loader if this is true.
 * @returns A loading icon that only appears when outstanding requests exist
 */
function Loader(): React.ReactElement|null {
    const requests = useCCSelector(state => state.global.outstandingRequests);
    const showLoader = requests.length > 0;

    return showLoader ? (
        <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
            top = "50%"
            right = "50%"
            zIndex = "10001"
        >
            <CircularProgress color={'primary'} />
        </Box>
    ) : null;
}

export default Loader;
