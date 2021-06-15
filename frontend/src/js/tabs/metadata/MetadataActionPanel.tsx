import React from 'react';
import { ActionPanel, ActionPanelItem } from 'solarspell-react-lib';
import { Edit, Delete } from '@material-ui/icons';

import { Metadata, MetadataType } from '../../types';

type MetadataActionPanelActionProps = {
    onEdit: (item: Metadata, val: string) => void
    onDelete: (item: Metadata) => void
}

type MetadataActionPanelProps = {
    metadata: Metadata
    metadataType: MetadataType
} & MetadataActionPanelActionProps

/**
 * The 'Actions' column in the MetadataEditor component.
 * This component displays the icons for editing/deleting metadata.
 * @param props The context and action callbacks.
 * @returns An action panel containing the Edit and Delete options for metadata.
 */
function MetadataActionPanel({
    onEdit,
    onDelete,
    metadata,
    metadataType,
}: MetadataActionPanelProps): React.ReactElement {
    const onAction = React.useCallback((val: string) => onEdit(metadata, val), [onEdit, metadata]);
    const onDelete_ = React.useCallback(() => onDelete(metadata), [onDelete, metadata]);

    return (
        <ActionPanel>
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
        </ActionPanel>
    );
}

export type { MetadataActionPanelActionProps };
export default MetadataActionPanel;
