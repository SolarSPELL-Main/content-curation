//Importing from outside the project
import React from 'react';
import {
  GridSelectionModelChangeParams,
  GridColDef,
  GridPageChangeParams,
} from '@material-ui/data-grid';

//Importing from other files in the project
import { ContentTable } from 'solarspell-react-lib';
import { useCCSelector } from '../../hooks';
import { hasPermission } from '../../utils';
import ShowForPermission from '../ShowForPermission';
import DeleteSelected from './DeleteSelected';
import ActionPanel from './ActionPanel';
import ContentForm from './ContentForm';
import Viewer from './Viewer';
import { Content, Metadata, MetadataType } from 'js/types';

type DisplayActionProps = {
  onEdit: (item: Content, vals: Partial<Content>) => void
  onDelete: (item: Content) => void
  onSelectedDelete: (content: Content[]) => void
  onPageSizeChange: (params: GridPageChangeParams) => void
  onPageChange: (params: GridPageChangeParams) => void
  onCreate: (
    metadataType: MetadataType,
    newTags: Metadata[],
  ) => Promise<Metadata[]>
}

type PaginationProps = {
  pageSize: number
  page: number
  rowCount: number
  loading: boolean
}

type DisplayProps = {
  metadata: Record<number, Metadata[]>
  metadataTypes: MetadataType[]
  content: Content[]
  actions: DisplayActionProps
  pageProps: PaginationProps
  additionalColumns: GridColDef[]
}

/**
 * Displays content in a table.
 * @param props Context and callbacks.
 * @returns A table to display all content.
 */
function Display({
  metadata,
  metadataTypes,
  content,
  actions,
  pageProps,
  additionalColumns,
}: DisplayProps): React.ReactElement {
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
  const [selected, setSelected] = React.useState<Content[]>([]);

  // Ensures deleted content is cleaned from state
  React.useEffect(
    () => {
      const ids = content.map(c => c.id);
      setSelected(s => s.filter(c => ids.includes(c.id)));
    },
    [content],
  );

  const onEdit_ = React.useCallback(
    (item: Content) => setEditedContent(item),
    [setEditedContent],
  );

  const onEditSubmit_ = React.useCallback(
    (item?: Partial<Content>) => {
      if (editedContent && item) {
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

  const onSelectChange_ = React.useCallback(
    (
      content: Content[],
      rows: GridSelectionModelChangeParams,
    ) => setSelected(
      content.filter(c => rows.selectionModel.includes(c.id))
    ),
    [setSelected],
  );

  return (
    <>
      <ShowForPermission slice={'content'} permission={'delete'}>
        <DeleteSelected
          selected={selected}
          onDelete={actions.onSelectedDelete}
        />
      </ShowForPermission>
      <ShowForPermission slice={'content'} permission={'update'}>
        {editedContent && <ContentForm
          metadata={metadata}
          metadataTypes={metadataTypes}
          onSubmit={onEditSubmit_}
          onCreate={actions.onCreate}
          open={!!editedContent}
          content={editedContent}
          type={'edit'}
        />}
      </ShowForPermission>
      <ShowForPermission slice={'content'} permission={'read'}>
        {viewedContent && <Viewer
          metadataTypes={metadataTypes}
          content={viewedContent}
          open={!!viewedContent}
          onClose={onViewClose_}
        />}
      </ShowForPermission>
      <ContentTable
        content={content}
        selectable={showDeleteSelection}
        onSelectChange={onSelectChange_}
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
          rowsPerPageOptions: [5, 10, 25],
          onPageSizeChange: actions.onPageSizeChange,
          onPageChange: actions.onPageChange,
          paginationMode: 'server',
          ...pageProps,
        }}
      />
    </>
  )
}

export type { DisplayActionProps, PaginationProps };
export default Display;
