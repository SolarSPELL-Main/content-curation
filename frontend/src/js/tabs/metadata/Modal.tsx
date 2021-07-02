//Importing from outside the project
import React from 'react';
import Box from '@material-ui/core/Box';

//Importing from other files in the project
import { MetadataDisplay } from 'solarspell-react-lib';
import KebabMenu, { KebabMenuActionProps } from './KebabMenu';
import ActionPanel, { ActionPanelActionProps } from './ActionPanel';
import TypeAdder, { TypeAdderActionProps } from './TypeAdder';
import { Metadata, MetadataType } from '../../types';

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
    return (
        <Box p={2}>
            <TypeAdder
                {...actions.AddType}
            />
            <MetadataDisplay
                metadata={metadata}
                metadataTypes={metadataTypes}
                tableProps={{
                    components: {
                        KebabMenu: KebabMenu,
                        ActionPanel: ActionPanel,
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
