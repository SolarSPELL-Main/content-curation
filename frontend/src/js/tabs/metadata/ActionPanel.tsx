//Importing from outside the project
import React from 'react';
import { Edit, Delete } from '@material-ui/icons';

//Importing from other files in the project
import { ActionPanel as SolarSPELLActionPanel, ActionPanelItem } from 
        'solarspell-react-lib';
import { Metadata, MetadataType } from '../../types';

type ActionPanelActionProps = {
    onEdit: (item: Metadata, val: string) => void
    onDelete: (item: Metadata) => void
}

type ActionPanelProps = {
    metadata: Metadata
    metadataType: MetadataType
} & ActionPanelActionProps

/**
 * The 'Actions' column in the MetadataEditor component.
 * This component displays the icons for editing/deleting metadata.
 * @param props The context and action callbacks.
 * @returns An action panel containing the Edit and Delete options for metadata.
 */
function ActionPanel({
    onEdit,
    onDelete,
    metadata,
    metadataType,
}: ActionPanelProps): React.ReactElement {
    const onAction = React.useCallback(
        (val: string) => onEdit(metadata, val), 
        [onEdit, metadata],
    );
    const onDelete_ = React.useCallback(
        () => onDelete(metadata), 
        [onDelete, metadata],
    );

    return (
        <SolarSPELLActionPanel>
            <ActionPanelItem
                type={'text_input'}
                tooltip={'Edit'}
                icon={Edit}
                onAction={onAction}
                textInputTitle={`Edit Metadata ${metadata.name}`}
                textInputLabel={'Metadata Name'}
            />
            <ActionPanelItem
                type={'confirm'}
                tooltip={'Delete'}
                icon={Delete}
                onAction={onDelete_}
                confirmationTitle={`Delete Metadata item ${metadata.name} of type ${metadataType.name}?`}
                confirmationDescription={'WARNING: Deleting a metadata will also delete each of that metadata on every content and is irreversible.'}
            />
        </SolarSPELLActionPanel>
    );
}

export type { ActionPanelActionProps };
export default ActionPanel;
