import type {
  GridSortModel
} from '@material-ui/data-grid';
import React from 'react';
import { MetadataDisplay } from 'solarspell-react-lib';
import { useCCDispatch, useCCSelector } from '../../hooks';
import * as MetadataActions from '../../state/metadata';
import { hasPermission } from '../../utils/permissions';
import ActionPanel from './ActionPanel';
import KebabMenu from './KebabMenu';

/**
 * This component is the table that displays all metadata types and their
 * corresponding metadata.
 * @returns A series of expandable panels and tables for all metadata types
 *          and metadata.
 */
function Table(): React.ReactElement {
  const metadata = useCCSelector(state => state.metadata.metadata);
  const metadataTypes = useCCSelector(state => state.metadata.metadata_types);
  const dispatch = useCCDispatch();
  const page = (id: number) => useCCSelector(state => state.metadata.metadata_page[id]);
  const pageSize = (id: number) => useCCSelector(state => state.metadata.metadata_pagesize[id]);


  //const [pageSize, setPageSize] = React.useState(5);
  // Default sort metadata by name
  const [sortModel, setSortModel] = React.useState<GridSortModel>([{
    field: 'name',
    sort: 'asc',
  }]);

  // Users who do not have any of the following permissions should not see the
  // empty Actions column.
  const permissions = useCCSelector(state => state.global.user.permissions);
  const showActionPanel = hasPermission(
    permissions,
    'metadata',
    ['update', 'delete'],
    'some',
  );

  return (
    <MetadataDisplay
      metadata={metadata}
      metadataTypes={metadataTypes}
      tableProps={{
        components: {
          KebabMenu: KebabMenu,
          ActionPanel: showActionPanel ? ActionPanel : undefined,
        },
        additionalProps: {
          rowsPerPageOptions: [5, 10, 25],
          sortModel: sortModel,
          onSortModelChange: params => 
            setSortModel(params.sortModel),
        },
        mountContents: false,
      }}
      paginationProps={{
        pageSize: pageSize,
        page: page,
        update: MetadataActions.update_pagination,
        dispatch: dispatch,
      }}
    />
  );
}

export default Table;
