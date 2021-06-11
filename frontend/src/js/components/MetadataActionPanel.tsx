import React from 'react';
import { ActionPanel, ActionPanelItem } from 'solarspell-react-lib';
import { Edit, Delete } from '@material-ui/icons';
import { Metadata, MetadataType } from '../types';

type MetadataActionPanelActionProps = {
    onEdit: (item: Metadata, val: string) => void
    onDelete: (item: Metadata) => void
}

type MetadataActionPanelProps = {
    metadata: Metadata
    metadataType: MetadataType
} & MetadataActionPanelActionProps

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
        />
        </ActionPanel>
    );
}

export type { MetadataActionPanelActionProps };
export default MetadataActionPanel;
