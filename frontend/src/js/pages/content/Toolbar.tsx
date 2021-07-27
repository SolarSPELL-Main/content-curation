import React from 'react';
import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

import ShowForPermission from '../ShowForPermission';
import Add from './Add';
import ColumnSelection from './ColumnSelection';
import { Content, Metadata, MetadataType } from 'js/types';

type ToolbarActionProps = {
    onAdd: (content?: Content) => void
    onCreate: (
        metadataType: MetadataType,
        newTags: Metadata[],
    ) => Promise<Metadata[]>
    onColumnSelect: (cols: GridColDef[]) => void
}

type ToolbarProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    actions: ToolbarActionProps
    initialColumns: Record<string, boolean>
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
    initialColumns
}: ToolbarProps): React.ReactElement {
    return (
        <Box mb={2} display={'flex'} justifyContent={'space-between'}>
            <Box>
                <ShowForPermission slice={'content'} permission={'create'}>
                    <Add
                        metadata={metadata}
                        metadataTypes={metadataTypes}
                        onAdd={actions.onAdd}
                        onCreate={actions.onCreate}
                    />
                </ShowForPermission>
            </Box>
            <Box>
                <ColumnSelection
                    metadataTypes={metadataTypes}
                    onClose={actions.onColumnSelect}
                    initialColumns={initialColumns}
                />
            </Box>
        </Box>
    );
}

export type { ToolbarActionProps };
export default Toolbar;
