import React from 'react';
import Button from '@material-ui/core/Button';
import { GridColDef } from '@material-ui/data-grid';

import { ContentColumnSelection } from 'solarspell-react-lib';
import { MetadataType, Content } from 'js/types';

type ColumnSelectionProps = {
    onClose: (cols: GridColDef[]) => void
    metadataTypes: MetadataType[]
}

function ColumnSelection({
    onClose,
    metadataTypes,
}: ColumnSelectionProps): React.ReactElement {
    const [open, setOpen] = React.useState(false);

    const open_ = React.useCallback(
        () => setOpen(true),
        [setOpen],
    );

    const close_ = React.useCallback(
        (cols: GridColDef[]) => {
            setOpen(false);
            onClose(cols);
        },
        [onClose, setOpen],
    );

    return (
        <>
            <Button
                variant={'contained'}
                color={'primary'}
                onClick={open_}
            >
                Column Select
            </Button>
            <ContentColumnSelection<Content, MetadataType>
                open={open}
                onClose={close_}
                fields={[
                    {
                        field: 'creator',
                        title: 'Created By',
                    },
                    {
                        field: 'createdDate',
                        title: 'Created On',
                    },
                    {
                        field: 'copyrighter',
                        title: 'Copyrighted By',
                    },
                    {
                        field: 'copyrightApproved',
                        title: 'Copyright Approved',
                        column: (field, hidden) => ({
                            field: field.field,
                            headerName: field.title,
                            flex: 1,
                            disableColumnMenu: true,
                            filterable: false,
                            hide: hidden,
                            valueFormatter: (params) => 
                                params.getValue(params.id, field.field) ?
                                    'Yes' : 'No'
                        }),
                    },
                    {
                        field: 'reviewer',
                        title: 'Reviewed By',
                    },
                    {
                        field: 'fileURL',
                        title: 'File URL',
                    },
                ]}
                metadataTypes={metadataTypes}
            />
        </>
    );
}

export default ColumnSelection;
