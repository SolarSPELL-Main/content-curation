import React from 'react';

import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

import ShowForPermission from '../../ShowForPermission';
import Add from './Add';
import ColumnSelection from './ColumnSelection';

/** Callbacks associated with the toolbar */
type ToolbarActionProps = {
    /** Callback on closing the Column Select dialog */
    onColumnSelect: (cols: GridColDef[]) => void
}

/** Main props type */
type ToolbarProps = {
    /** Callbacks associated with the toolbar */
    actions: ToolbarActionProps
    /** Initial column selection state of the Column Select dialog */
    initialColumns: Record<string, boolean>
}

/**
 * Constructs the toolbar above the search bar on the content tab.
 * @param props Callbacks and context of the toolbar.
 * @returns A toolbar with buttons for several actions.
 */
function Toolbar({
  actions,
  initialColumns,
}: ToolbarProps): React.ReactElement {
  return (
    <Box mb={2} display={'flex'} justifyContent={'space-between'}>
      <Box>
        <ShowForPermission slice={'content'} permission={'create'}>
          <Add />
        </ShowForPermission>
      </Box>
      <Box>
        <ColumnSelection
          onClose={actions.onColumnSelect}
          initialColumns={initialColumns}
        />
      </Box>
    </Box>
  );
}

export type { ToolbarActionProps };
export default Toolbar;
