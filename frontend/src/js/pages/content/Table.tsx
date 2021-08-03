//Importing from outside the project
import React from 'react';
import type {
  GridSelectionModelChangeParams,
  GridColDef,
  GridPageChangeParams,
  GridSortModel,
  GridSortModelParams,
} from '@material-ui/data-grid';

//Importing from other files in the project
import { ContentTable } from 'solarspell-react-lib';
import { useCCSelector } from '../../hooks';
import { hasPermission } from '../../utils';
import ShowForPermission from '../ShowForPermission';
import ActionPanel from './ActionPanel';
import ContentForm from './ContentForm';
import Viewer from './Viewer';
import { Content } from 'js/types';

type TableActionProps = {
  onEdit: (item: Content, vals?: Partial<Content>) => void
  onDelete: (item: Content) => void
  onPageSizeChange: (params: GridPageChangeParams) => void
  onPageChange: (params: GridPageChangeParams) => void
  onSelectChange: (params: GridSelectionModelChangeParams) => void
}

type PaginationProps = {
  pageSize: number
  page: number
  rowCount: number
}

type SortingProps = {
  sortModel: GridSortModel,
  onSortModelChange: (params: GridSortModelParams) => void
}

type TableProps = {
  content: Content[]
  actions: TableActionProps
  pageProps: PaginationProps
  sortProps: SortingProps
  selected: number[]
  additionalColumns: GridColDef[]
}

/**
 * Displays content in a table.
 * @param props Context and callbacks.
 * @returns A table to display all content.
 */
function Table({
  content,
  actions,
  pageProps,
  sortProps,
  selected,
  additionalColumns,
}: TableProps): React.ReactElement {
  const permissions = useCCSelector(state => state.global.user.permissions);

  // Users who do not have any of these permissions should not see
  // the empty Actions column.
  const showActionPanel = hasPermission(
    permissions,
    'content',
    ['read', 'update', 'delete'],
    'some',
  );
  
  // Users who cannot delete should both not see the 'Delete Selected' button
  // nor be able to select content from the content table.
  const showDeleteSelection = hasPermission(
    permissions,
    'content',
    'delete',
  );

  const [editedContent, setEditedContent] = React.useState<Content|undefined>();
  const [viewedContent, setViewedContent] = React.useState<Content|undefined>();
  const ids = content.map(c => c.id);

  const onEdit_ = React.useCallback(
    (item: Content) => setEditedContent(item),
    [setEditedContent],
  );

  const onEditSubmit_ = React.useCallback(
    (item?: Partial<Content>) => {
      if (editedContent) {
        actions.onEdit(editedContent, item);
      }
      setEditedContent(undefined);
    },
    [actions.onEdit, editedContent, setEditedContent],
  );

  const onView_ = React.useCallback(
    (item: Content) => setViewedContent(item),
    [setViewedContent],
  );

  const onViewClose_ = React.useCallback(
    () => setViewedContent(undefined),
    [setViewedContent],
  );

  return (
    <>
      <ShowForPermission slice={'content'} permission={'update'}>
        {editedContent && <ContentForm
          onSubmit={onEditSubmit_}
          open={!!editedContent}
          content={editedContent}
          type={'edit'}
        />}
      </ShowForPermission>
      <ShowForPermission slice={'content'} permission={'read'}>
        {viewedContent && <Viewer
          content={viewedContent}
          open={!!viewedContent}
          onClose={onViewClose_}
        />}
      </ShowForPermission>
      <ContentTable
        content={content}
        selectable={showDeleteSelection}
        components={{
          ActionPanel: showActionPanel ? ActionPanel : undefined,
        }}
        componentProps={{
          ActionPanel: {
            ...actions,
            onEdit: onEdit_,
            onView: onView_,
          },
        }}
        additionalColumns={additionalColumns}
        additionalProps={{
          // DataGrid does not take it well when selection model includes
          // IDs that are not within its rows
          selectionModel: selected.filter(id => ids.includes(id)),
          onSelectionModelChange: actions.onSelectChange,
          rowsPerPageOptions: [10, 25, 100],
          onPageSizeChange: actions.onPageSizeChange,
          onPageChange: actions.onPageChange,
          paginationMode: 'server',
          sortingMode: 'server',
          ...pageProps,
          ...sortProps,
        }}
      />
    </>
  )
}

export type { TableActionProps, PaginationProps, SortingProps };
export default Table;
