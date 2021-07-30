import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import SvgIcon from '@material-ui/core/SvgIcon';
import { GridColDef } from '@material-ui/data-grid';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import HighlightOff from '@material-ui/icons/HighlightOff';
import PrettyBytes from 'pretty-bytes';

import { ContentColumnSelection } from 'solarspell-react-lib';
import { MetadataType, Content } from 'js/types';

type ColumnSelectionProps = {
    onClose: (cols: GridColDef[]) => void
    metadataTypes: MetadataType[]
    initialColumns: Record<string, boolean>
}

function ColumnSelection({
    onClose,
    metadataTypes,
    initialColumns
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
                        field: 'copyrightApproved',
                        title: 'Copyright Approved',
                        column: (field, hidden) => ({
                            field: field.field,
                            headerName: field.title,
                            flex: 1,
                            disableColumnMenu: true,
                            filterable: false,
                            hide: hidden,
                            renderCell: params => (
                                <SvgIcon
                                    htmlColor={!!params.getValue(
                                        params.id, field.field
                                    ) ?
                                        'green'
                                        :
                                        'darkRed'
                                    }
                                    style={{
                                        marginLeft: '1em',
                                    }}
                                >
                                    {!!params.getValue(
                                        params.id, field.field
                                    ) ?
                                        <CheckCircleOutline />
                                        :
                                        <HighlightOff />
                                    }
                                </SvgIcon>
                            )
                        }),
                    },
                    {
                        field: 'copyrighter',
                        title: 'Copyrighted By',
                    },
                    {
                        field: 'status',
                        title: 'Status',
                        column: (field, hidden) => ({
                            field: field.field,
                            headerName: field.title,
                            flex: 1,
                            disableColumnMenu: true,
                            filterable: false,
                            hide: hidden,
                        }),
                    },
                    {
                        field: 'reviewer',
                        title: 'Reviewed By',
                    },
                    {
                        field: 'reviewedDate',
                        title: 'Reviewed On',
                    },
                    {
                        field: 'fileURL',
                        title: 'File URL',
                        column: (field, hidden) => ({
                            field: field.field,
                            headerName: field.title,
                            flex: 1,
                            disableColumnMenu: true,
                            filterable: false,
                            hide: hidden,
                            renderCell: (params) => {
                                const url = params.formattedValue as string;

                                if (url) {
                                    return (
                                        <Link href={url} target={'_blank'}>
                                            {url}
                                        </Link>
                                    )
                                } else {
                                    return null;
                                }
                            },
                        }),
                    },
                    {
                        field: 'filesize',
                        title: 'File Size',
                        column: (field, hidden) => ({
                            field: field.field,
                            headerName: field.title,
                            flex: 1,
                            disableColumnMenu: true,
                            filterable: false,
                            hide: hidden,
                            valueFormatter: (params) => {
                                const filesize = params.getValue(
                                    params.id,
                                    field.field
                                ) as number;

                                if (filesize != null) {
                                    return PrettyBytes(filesize);
                                } else {
                                    return null;
                                }
                            },
                        }),
                    },
                ]}
                metadataTypes={metadataTypes}
                initialState={initialColumns}
            />
        </>
    );
}

export default ColumnSelection;
