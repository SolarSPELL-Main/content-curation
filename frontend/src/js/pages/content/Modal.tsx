//Importing from outside the project
import React, {useState} from 'react';
import Box from '@material-ui/core/Box';
import { GridColDef } from '@material-ui/data-grid';

//Importing from other files in the project
import Toolbar from './Toolbar';
import SearchBar from './SearchBar';
import SelectedToolbar from './SelectedToolbar';
import Table, {
    TableActionProps,
    PaginationProps,
    SortingProps,
} from './Table';
import { Content } from 'js/types';
import Cookies from 'js-cookie';

type ModalProps = {
    content: Content[]
    actions: {
        Table: TableActionProps
    }
    pageProps: PaginationProps
    sortProps: SortingProps
    selected: number[]
}

function Modal({
    content,
    actions,
    pageProps,
    sortProps,
    selected,
}: ModalProps): React.ReactElement {
    // GridColDef is not serializable, hence column management must occur here
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
                actions={{
                    onColumnSelect: setCols
                }}
                initialColumns={initialColumns}
            />
            <SearchBar />
            <div style={{marginTop: ".5em"}}/>
            <SelectedToolbar />
            <div style={{marginTop: ".5em"}}/>
            <Table
                content={content}
                actions={actions.Table}
                additionalColumns={cols}
                pageProps={pageProps}
                sortProps={sortProps}
                selected={selected}
            />
        </Box>
    );
}

export default Modal;
