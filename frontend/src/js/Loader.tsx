import React from 'react';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

/** Main props type */
type LoaderProps = {
    /** Whether to show the loader. Defaults to true */
    open?: boolean
}

/**
 * The circular loading icon that appears in the middle of the screen during
 * API requests or other async operations.
 * @returns A loading icon
 */
function Loader({
  open=true,
}: LoaderProps): React.ReactElement|null {
  return open ? (
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
