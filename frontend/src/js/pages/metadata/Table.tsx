import React from 'react';

import type {
    GridSortModel,
} from '@material-ui/data-grid';

import { MetadataDisplay } from 'solarspell-react-lib';
import { useCCSelector } from '../../hooks';
import { hasPermission } from '../../utils';
import KebabMenu from './KebabMenu';
import ActionPanel from './ActionPanel';

/**
 * This component is the table that displays all metadata types and their
 * corresponding metadata.
 * @returns A series of expandable panels and tables for all metadata types
 *          and metadata.
 */
function Table(): React.ReactElement {
    const metadata = useCCSelector(state => state.metadata.metadata);
    const metadataTypes = useCCSelector(state => state.metadata.metadata_types);

    const [pageSize, setPageSize] = React.useState(5);
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
                    pageSize: pageSize,
                    onPageSizeChange: params => setPageSize(params.pageSize),
                    rowsPerPageOptions: [5, 10, 25],
                    sortModel: sortModel,
                    onSortModelChange: params => 
                        setSortModel(params.sortModel),
                },
                mountContents: false,
            }}
        />
    );
}

export default Table;
