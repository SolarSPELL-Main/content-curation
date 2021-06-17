import React from 'react';
import Box from '@material-ui/core/Box';
import { MetadataDisplay } from 'solarspell-react-lib';
import MetadataKebabMenu, { MetadataKebabMenuActionProps } from './MetadataKebabMenu';
import MetadataActionPanel, { MetadataActionPanelActionProps } from './MetadataActionPanel';
import MetadataTypeAdder, { MetadataTypeAdderActionProps } from './MetadataTypeAdder';

import { Metadata, MetadataType } from '../../types';

type ModalActionProps = {
    actions: {
        KebabMenu: MetadataKebabMenuActionProps
        ActionPanel: MetadataActionPanelActionProps
        AddType: MetadataTypeAdderActionProps
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
    return (
        <Box p={2}>
            <MetadataTypeAdder
                {...actions.AddType}
            />
            <MetadataDisplay
                metadata={metadata}
                metadataTypes={metadataTypes}
                tableProps={{
                    components: {
                        KebabMenu: MetadataKebabMenu,
                        ActionPanel: MetadataActionPanel,
                    },
                    componentProps: {
                        KebabMenu: actions.KebabMenu,
                        ActionPanel: actions.ActionPanel,
                    },
                }}
            />
        </Box>
    );
}

export default Modal;
