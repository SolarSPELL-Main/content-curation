//Importing from outside the project
import React from 'react';
import {
  GridSelectionModelChangeParams,
  GridColDef,
} from '@material-ui/data-grid';

//Importing from other files in the project
import { ContentTable } from 'solarspell-react-lib';
import DeleteSelected from './DeleteSelected';
import ActionPanel from './ActionPanel';
import ContentForm from './ContentForm';
import Viewer from './Viewer';
import { Content, Metadata, MetadataType } from 'js/types';

type DisplayActionProps = {
  onEdit: (item: Content, vals: Partial<Content>) => void
  onDelete: (item: Content) => void
  onSelectedDelete: (content: Content[]) => void
}

type DisplayProps = {
  metadata: Record<number, Metadata[]>
  metadataTypes: MetadataType[]
  content: Content[]
  actions: DisplayActionProps
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
  additionalColumns,
}: DisplayProps): React.ReactElement {
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
      <DeleteSelected
        selected={selected}
        onDelete={actions.onSelectedDelete}
      />
      {editedContent && <ContentForm
        metadata={metadata}
        metadataTypes={metadataTypes}
        onSubmit={onEditSubmit_}
        open={!!editedContent}
        content={editedContent}
        type={'edit'}
      />}
      {viewedContent && <Viewer
        metadataTypes={metadataTypes}
        content={viewedContent}
        open={!!viewedContent}
        onClose={onViewClose_}
      />}
      <ContentTable
        content={content}
        selectable
        onSelectChange={onSelectChange_}
        components={{
          ActionPanel: ActionPanel,
        }}
        componentProps={{
          ActionPanel: {
            ...actions,
            onEdit: onEdit_,
            onView: onView_,
          },
        }}
        additionalColumns={additionalColumns}
      />
    </>
  )
}

export type { DisplayActionProps };
export default Display;
