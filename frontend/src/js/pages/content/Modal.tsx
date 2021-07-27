//Importing from outside the project
import React, {useState} from 'react';
import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

//Importing from other files in the project
import Toolbar, { ToolbarActionProps } from './Toolbar';
import SearchBar from './SearchBar';
import SelectedToolbar, { SelectedToolbarActions } from './SelectedToolbar';
import Display, {
    DisplayActionProps,
    PaginationProps,
    SortingProps,
} from './Display';
import { Content, Metadata, MetadataType, Query } from 'js/types';
import Cookies from 'js-cookie';

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
    sortProps: SortingProps
    selected: number[]
}

function Modal({
    metadata,
    metadataTypes,
    content,
    actions,
    pageProps,
    sortProps,
    selected,
}: ModalProps): React.ReactElement {
    const [cols, setCols] = useState<GridColDef[]>([])
    React.useEffect(() => {
        Cookies.set("columns", JSON.stringify(cols.reduce((obj, col) => {
            if (!col.hide) {
                obj[col.field] = true
            }
            return obj
        }, {} as Record<string, boolean>)), {
            expires: 365
        })
    }, [cols])

    const [initialColumns] = useState<Record<string, boolean>>(
        JSON.parse(Cookies.get("columns") ?? "{}")
    )
    
    return (
        <Box p={2}>
            <Toolbar
                metadata={metadata}
                metadataTypes={metadataTypes}
                actions={{
                    ...actions.Toolbar,
                    onColumnSelect: setCols
                }}
                initialColumns={initialColumns}
            />
            <SearchBar
                metadata={metadata}
                metadataTypes={metadataTypes}
                onQueryChange={actions.Search.onQueryChange}
            />
            <div style={{marginTop: ".5em"}}/>
            <SelectedToolbar
                actions={actions.SelectedToolbar}
                selected={selected}
            />
            <div style={{marginTop: ".5em"}}/>
            <Display
                metadata={metadata}
                metadataTypes={metadataTypes}
                content={content}
                actions={actions.Display}
                additionalColumns={cols}
                pageProps={pageProps}
                sortProps={sortProps}
                selected={selected}
            />
        </Box>
    );
}

export default Modal;
