import React from 'react';

import { GridColDef } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import PrettyBytes from 'pretty-bytes';

import { ContentColumnSelection } from 'solarspell-react-lib';
import { useCCSelector } from '../../../hooks';
import { MetadataType, Content } from 'js/types';

/** Main props type */
type ColumnSelectionProps = {
    /** Callback on closing the dialog */
    onClose: (cols: GridColDef[]) => void
    /** Initial state of the ContentColumnSelection component */
    initialColumns: Record<string,boolean>
}

/**
 * The column selection factory for the content tab.
 * Allows the user to select which pieces of information related to content
 * they want displayed in the columns of the table.
 * It is displayed in the top right of the content tab.
 * @param props The context and callback for the column selection.
 * @returns A button associated with a dialog for column selection.
 */
function ColumnSelection({
  onClose,
  initialColumns,
}: ColumnSelectionProps): React.ReactElement {
  const metadataTypes = useCCSelector(state => state.metadata.metadata_types);
  const copyrightPermissions = useCCSelector(state => state.copyright.copyright)
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        variant={'contained'}
        color={'primary'}
        onClick={() => setOpen(true)}
        style={{ marginRight: '0px' }}
      >
                Column Select
      </Button>
      <ContentColumnSelection<Content, MetadataType>
        open={open}
        onClose={cols => {
          setOpen(false);
          onClose(cols);
        }}
        fields={[
          {
            field: 'display_title',
            title: "Display Title",
          },
          {
            field: 'creator',
            title: 'Created By',
          },
          {
            field: 'createdDate',
            title: 'Created On',
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
                  );
                } else {
                  return null;
                }
              },
            }),
          },
          {
            field: "copyright",
            title: "Copyright",
            column: (field, hidden) => ({
                field: field.field,
                headerName: field.title,
                flex: 1,
                disableColumnMenu: true,
                filterable: false,
                hide: hidden,
                renderCell: params => copyrightPermissions
                    .find(perm => perm.id == params.formattedValue)?.description
            })
          },
          {
            field: "copyright_notes",
            title: "Copyright Notes",
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
