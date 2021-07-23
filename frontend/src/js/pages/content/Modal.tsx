//Importing from outside the project
import React from 'react';
import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

//Importing from other files in the project
import Toolbar, { ToolbarActionProps } from './Toolbar';
import SearchBar from './SearchBar';
import SelectedToolbar, { SelectedToolbarActions } from './SelectedToolbar';
import Display, { DisplayActionProps, PaginationProps } from './Display';
import { Content, Metadata, MetadataType, Query } from 'js/types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    content: Content[]
    actions: {
        Display: DisplayActionProps
        Toolbar: Omit<ToolbarActionProps,'onColumnSelect'>
        SelectedToolbar: SelectedToolbarActions
        Search: {
            onQueryChange: (query: Query) => void
        }
    }
    pageProps: PaginationProps
    selected: number[]
}

function Modal({
    metadata,
    metadataTypes,
    content,
    actions,
    pageProps,
    selected,
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
            <SelectedToolbar
                actions={actions.SelectedToolbar}
                selected={selected}
            />
            <Display
                metadata={metadata}
                metadataTypes={metadataTypes}
                content={content}
                actions={actions.Display}
                additionalColumns={cols}
                pageProps={pageProps}
                selected={selected}
            />
        </Box>
    );
}

export default Modal;
