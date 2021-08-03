//Importing from outside the project
import React from 'react';
import type {
  GridColDef,
} from '@material-ui/data-grid';

//Importing from other files in the project
import { ContentTable } from 'solarspell-react-lib';
import * as ContentActions from '../../state/content';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { hasPermission } from '../../utils';
import ActionPanel from './ActionPanel';

type TableProps = {
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
  const userID = useCCSelector(state => state.global.user.user_id);

  // Re-fetch content everytime pagination/sorting/user changes
  React.useEffect(() => {
      if (userID !== 0) {
          dispatch(ContentActions.fetch_content());
      }
  }, [dispatch, page, pageSize, sortModel, userID]);

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

  const ids = content.map(c => c.id);

  return (
    <ContentTable
      content={content}
      selectable={showDeleteSelection}
      components={{
        ActionPanel: showActionPanel ? ActionPanel : undefined,
      }}
      additionalColumns={additionalColumns}
      additionalProps={{
        // DataGrid does not take it well when selection model includes
        // IDs that are not within its rows
        selectionModel: selected.filter(id => ids.includes(id)),
        onSelectionModelChange: params => {
          const ids = params.selectionModel as number[];

          // This callback seems to fire infinitely without an
          // equality check of some kind. Likely since array
          // equality is almost never true between renders.
          const isNew = ids.some(id => !selectionModel.includes(id))
              || ids.length !== selectionModel.length;

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
  )
}

export default Table;
