//Importing from outside the project
import React from 'react';
import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

//Importing from other files in the project
import Toolbar, { ToolbarActionProps } from './Toolbar';
import SearchBar from './SearchBar';
import Display, { DisplayActionProps } from './Display';
import { Content, Metadata, MetadataType, Query } from 'js/types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    content: Content[]
    actions: {
        Display: DisplayActionProps
        Toolbar: Omit<ToolbarActionProps,'onColumnSelect'>
        Search: {
            onQueryChange: (query: Query) => void
        }
    }
}

function Modal({
    metadata,
    metadataTypes,
    content,
    actions,
}: ModalProps): React.ReactElement {
    const [cols, setCols] = React.useState<GridColDef[]>([]);

    return (
        <Box p={2}>
            <Toolbar
                metadata={metadata}
                metadataTypes={metadataTypes}
                actions={{
                    ...actions.Toolbar,
                    onColumnSelect: setCols,
                }}
            />
            <SearchBar
                metadata={metadata}
                metadataTypes={metadataTypes}
                onQueryChange={actions.Search.onQueryChange}
            />
            <Display
                metadata={metadata}
                metadataTypes={metadataTypes}
                content={content}
                actions={actions.Display}
                additionalColumns={cols}
            />
        </Box>
    );
}

export default Modal;
