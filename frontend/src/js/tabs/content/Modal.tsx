import React from 'react';
import Box from '@material-ui/core/Box';
import MetadataSelector from './MetadataSelector';
import MetadataSubmitter from './MetadataSubmitter';

import { Metadata, MetadataType } from '../../types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onSubmit: (metadata: Record<number, Metadata[]>) => void
}

/**
 * This component is the main modal for the content tab of the web app.
 * It allows certain metadata tags to be selected from dropdowns.
 * @param props The context and callback for the modal.
 * @returns A form through which metadata tags can be selected and submitted.
 */
function Modal({
    metadata,
    metadataTypes,
    onSubmit,
}: ModalProps): React.ReactElement {
    // State hook for metadata
    const [selectedMetadataState, setSelectedMetadataState] = React.useState<Record<number, Metadata[]>>(() => {
        // Initialize state with all metadataTypes ID keys
        const initialMetadata: Record<number, Metadata[]> = {};
        for (const metadataType of metadataTypes) {
            initialMetadata[metadataType.id] = [];
        }
        return initialMetadata;
    });

    // Callback for selection changes in selector
    const onSelectChange = React.useCallback((metadata_, metadataType_, rows) => {
        const metadata: Metadata[] = metadata_ as Metadata[];
        const metadataType: MetadataType = metadataType_ as MetadataType;
        const metadataIDs: number[] = rows.selectionModel;
        const selectedMetadata: Metadata[] = metadata.filter(v => metadataIDs.includes(v.id));
        setSelectedMetadataState(oldState => {
            oldState[metadataType.id] = selectedMetadata;
            return oldState;
        });
    }, [setSelectedMetadataState]);

    // Callback for submission
    const onSubmit_ = React.useCallback(() => onSubmit(selectedMetadataState), [onSubmit, selectedMetadataState]);

    return (
        <Box p={2}>
            <MetadataSelector
                metadata={metadata}
                metadataTypes={metadataTypes}
                onSelectChange={onSelectChange}
            />
            <MetadataSubmitter
                onSubmit={onSubmit_}
            />
        </Box>
    );
}

export default Modal;
