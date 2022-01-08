import React, {useState} from 'react';

import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

import Toolbar from './Toolbar';
import SearchBar from './SearchBar';
import SelectedToolbar from './SelectedToolbar';
import Table from './Table';
import Cookies from 'js-cookie';

/**
 * The body of the content tab.
 * @returns Toolbars, search bar, and the table rendered as one.
 */
function Body(): React.ReactElement {
  // GridColDef is not serializable, hence column management must occur here
  const [cols, setCols] = useState<GridColDef[]>([]);
  React.useEffect(() => {
    Cookies.set('columns', JSON.stringify(cols.reduce((obj, col) => {
      if (!col.hide) {
        obj[col.field] = true;
      }
      return obj;
    }, {} as Record<string, boolean>)), {
      expires: 365,
    });
  }, [cols]);
    

  const [initialColumns] = useState<Record<string, boolean>>(
    JSON.parse(Cookies.get('columns') ?? '{}')
  );
    
  return (
    <Box p={2}>
      <Toolbar
        actions={{
          onColumnSelect: setCols,
        }}
        initialColumns={initialColumns}
      />
      <SearchBar />
      <div style={{marginTop: '.5em'}}/>
      <SelectedToolbar />
      <div style={{marginTop: '.5em'}}/>
      <Table
        additionalColumns={cols}
      />
    </Box>
  );
}

export default Body;
