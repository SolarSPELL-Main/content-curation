import React from 'react';

import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

import ShowForPermission from '../../ShowForPermission';
import Add from './Add';
import ColumnSelection from './ColumnSelection';

type ToolbarActionProps = {
    onColumnSelect: (cols: GridColDef[]) => void
}

type ToolbarProps = {
    actions: ToolbarActionProps
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
