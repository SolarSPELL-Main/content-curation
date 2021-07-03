//Importing from outside the project
import React from 'react';
import Box from '@material-ui/core/Box';

//Importing from other files in the project
import Add from './Add';
import SearchBar from './SearchBar';
import Display, { DisplayActionProps } from './Display';
import { Content, Metadata, MetadataType, Query } from 'js/types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    content: Content[]
    actions: {
        Display: DisplayActionProps
        Toolbar: {
            onAdd: (content: Content) => void
        }
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
    return (
        <Box p={2}>
            <Add
                metadata={metadata}
                metadataTypes={metadataTypes}
                onAdd={actions.Toolbar.onAdd}
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
            />
        </Box>
    );
}

export default Modal;
