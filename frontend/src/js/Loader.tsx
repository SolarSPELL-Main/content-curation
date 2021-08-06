import React from 'react';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useCCSelector } from './hooks';

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
