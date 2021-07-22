//Importing from outside the project
import React from 'react';
import Box from '@material-ui/core/Box';

//Importing from other files in the project
import { MetadataDisplay } from 'solarspell-react-lib';
import { useCCSelector } from '../../hooks';
import { hasPermission } from '../../utils';
import ShowForPermission from '../ShowForPermission';
import KebabMenu, { KebabMenuActionProps } from './KebabMenu';
import ActionPanel, { ActionPanelActionProps } from './ActionPanel';
import TypeAdder, { TypeAdderActionProps } from './TypeAdder';
import { Metadata, MetadataType } from 'js/types';

type ModalActionProps = {
    actions: {
        KebabMenu: KebabMenuActionProps
        ActionPanel: ActionPanelActionProps
        AddType: TypeAdderActionProps
    }
}

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
} & ModalActionProps

/**
 * This component is the main modal for the metadata tab of the web app.
 * It allows metadata and metadata types to be added/edited/deleted.
 * @param props The context and callback for the modal.
 * @returns A form through which metadata and metadata types can be edited.
 */
function Modal({
    metadata,
    metadataTypes,
    actions,
}: ModalProps): React.ReactElement {
    const [pageSize, setPageSize] = React.useState(5);
    const permissions = useCCSelector(state => state.global.user.permissions);

    // Users who do not have any of these permissions should not see the
    // empty Actions column.
    const showActionPanel = hasPermission(
        permissions,
        'metadata',
        ['update', 'delete'],
        'some',
    ) || hasPermission(
        permissions,
        'special',
        'export',
    );

    return (
        <Box p={2}>
            <ShowForPermission slice={'metadata'} permission={'create'}>
                <TypeAdder
                    {...actions.AddType}
                />
            </ShowForPermission>
            <MetadataDisplay
                metadata={metadata}
                metadataTypes={metadataTypes}
                tableProps={{
                    components: {
                        KebabMenu: KebabMenu,
                        ActionPanel: showActionPanel ? ActionPanel : undefined,
                    },
                    componentProps: {
                        KebabMenu: actions.KebabMenu,
                        ActionPanel: actions.ActionPanel,
                    },
                    additionalProps: {
                        pageSize: pageSize,
                        onPageSizeChange: params => setPageSize(params.pageSize),
                        rowsPerPageOptions: [5, 10, 25],
                    },
                }}
            />
        </Box>
    );
}

export default Modal;
