import React from 'react';

import Paper from '@material-ui/core/Paper';
import type {
  GridColDef,
} from '@material-ui/data-grid';

import { ContentTable } from 'solarspell-react-lib';
import * as ContentActions from '../../state/content';
import * as MetadataActions from '../../state/metadata';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { hasPermission } from '../../utils/permissions';
import ContentForm from './ContentForm';
import Viewer from './Viewer';
import ActionPanel from './ActionPanel';
import { Content } from '../../types';
import {AuthGroup} from '../../enums';

/** Main props type */
type TableProps = {
  /** Columns to display in addition to default columns */
  additionalColumns: GridColDef[]
}

/**
 * Displays content in a table.
 * @param props Additional columns to display in the table.
 * @returns A table to display all content.
 */
function Table({
  additionalColumns,
}: TableProps): React.ReactElement {
  const dispatch = useCCDispatch();
  const content = useCCSelector(state => state.content.content);
  const rowCount = useCCSelector(state => state.content.total);
  const page = useCCSelector(state => state.content.page);
  const pageSize = useCCSelector(state => state.content.pageSize);
  const selected = useCCSelector(state => state.content.selected);
  const selectionModel = useCCSelector(state => state.content.selectionModel);
  const sortModel = useCCSelector(state => state.content.sortModel);
  const user = useCCSelector(state => state.global.user);

  // Re-fetch content everytime pagination/sorting/user changes
  React.useEffect(() => {
      if (user.user_id !== 0) {
          dispatch(ContentActions.fetch_content());
      }
  }, [dispatch, page, pageSize, sortModel, user]);

  const permissions = useCCSelector(state => state.global.user.permissions);

  // Users who do not have any of these permissions should not see
  // the empty Actions column.
  const showActionPanel = hasPermission(
    permissions,
    'content',
    ['read', 'update', 'delete'],
    'some',
  );

  // Permissions for individual Action icons
  const showEdit = hasPermission(permissions, 'content', 'update');
  const showDelete = user.groups.includes(AuthGroup.LIB_SPECIALIST) ?
    true :
    hasPermission(permissions, 'content', 'delete') && ((content: Content) => content.creator == user.username)
  const showView = hasPermission(permissions, 'content', 'read');
  
  // Only users who can delete or export content should have the option to
  // select rows of content in the table.
  const showSelection = hasPermission(
    permissions,
    'content',
    'delete',
  ) || hasPermission(
    permissions,
    'special',
    'export',
  );

  // Other state
  const [editedContent, setEditedContent] = React.useState<Content>();
  const [viewedContent, setViewedContent] = React.useState<Content>();

  const ids = content.map(c => c.id);

  return (
    <>
      {
        editedContent && <ContentForm
          open={!!editedContent}
          onSubmit={newContent => {
            setEditedContent(undefined);
            if (newContent) {
              newContent.id = editedContent.id;
              dispatch(ContentActions.edit_content(newContent as Content));
            }

            // Clear newly added
            dispatch(MetadataActions.update_newly_added([]));
          }}
          content={editedContent}
          type={'edit'}
        />
      }
      {
        viewedContent && <Viewer
          open={!!viewedContent}
          content={viewedContent}
          onClose={() => setViewedContent(undefined)}
        />
      }
      <Paper>
        <ContentTable
          content={content}
          selectable={showSelection}
          components={{
            ActionPanel: showActionPanel ? ActionPanel : undefined,
          }}
          componentProps={{
            ActionPanel: {
              onEdit: (c: Content) => setEditedContent(c),
              onView: (c: Content) => setViewedContent(c),
              showEdit,
              showDelete,
              showView,
            },
          }}
          additionalColumns={additionalColumns}
          additionalProps={{
            // DataGrid does not take it well when selection model includes
            // IDs that are not within its rows, so selected must be filtered
            // to only currently displayed content
            selectionModel: selected.filter(id => ids.includes(id)),
            onSelectionModelChange: params => {
              const selectionIDs = params.selectionModel as number[];

              // This callback seems to fire infinitely without an
              // equality check of some kind. Likely since array
              // equality is almost never true between renders.
              const isNew = selectionIDs.some(
                id => !selectionModel.includes(id)
              ) || selectionIDs.length !== selectionModel.length;

              if (isNew) {
                dispatch(ContentActions.update_selected(
                  params.selectionModel as number[],
                ));
              }
            },
            rowsPerPageOptions: [10, 25, 100],
            onPageSizeChange: params => 
              dispatch(ContentActions.update_pagination({
                pageSize: params.pageSize,
                page: params.page,
              })),
            onPageChange: params => 
              dispatch(ContentActions.update_pagination({
                page: params.page,
              })),
            paginationMode: 'server',
            sortingMode: 'server',
            pageSize: pageSize,
            page: page,
            rowCount: rowCount,
            sortModel: sortModel,
            onSortModelChange: params => 
                  dispatch(ContentActions.update_sortmodel(params.sortModel)),
          }}
        />
      </Paper>
    </>
  );
}

export default Table;
