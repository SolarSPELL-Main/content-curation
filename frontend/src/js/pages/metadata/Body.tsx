import React from 'react';

import Box from '@material-ui/core/Box';

import ShowForPermission from '../ShowForPermission';
import TypeAdder from './TypeAdder';
import Table from './Table';

/**
 * This component is the main body for the metadata tab of the web app.
 * It allows metadata and metadata types to be added/edited/deleted/exported.
 * @returns A page through which metadata and metadata types can be managed.
 */
function Body(): React.ReactElement {
  return (
    <Box p={2}>
      <ShowForPermission slice={'metadata'} permission={'create'}>
        <TypeAdder />
      </ShowForPermission>
      <div style={{marginTop: '1em'}} />
      <Table />
    </Box>
  );
}

export default Body;
