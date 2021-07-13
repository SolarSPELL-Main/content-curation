import React from 'react';
import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

import Add from './Add';
import ColumnSelection from './ColumnSelection';
import { Content, Metadata, MetadataType } from 'js/types';

type ToolbarActionProps = {
    onAdd: (content: Content) => void
    onColumnSelect: (cols: GridColDef[]) => void
}

type ToolbarProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    actions: ToolbarActionProps
}

/**
 * Constructs the toolbar above the search bar on the content tab.
 * @param props Callbacks and context of the toolbar.
 * @returns A toolbar with buttons for several actions.
 */
function Toolbar({
    metadata,
    metadataTypes,
    actions,
}: ToolbarProps): React.ReactElement {
    return (
        <Box mb={2} display={'flex'} justifyContent={'space-between'}>
            <Add
                metadata={metadata}
                metadataTypes={metadataTypes}
                onAdd={actions.onAdd}
            />
            <ColumnSelection
                metadataTypes={metadataTypes}
                onClose={actions.onColumnSelect}
            />
        </Box>
    );
}

export type { ToolbarActionProps };
export default Toolbar;
