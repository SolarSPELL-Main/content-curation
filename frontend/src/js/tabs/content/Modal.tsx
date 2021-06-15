import React from 'react';
import MetadataSelector from './MetadataSelector';
import Button from '@material-ui/core/Button';

import { Metadata, MetadataType } from '../../types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onClick: (metadata: Record<number, Metadata[]>) => void
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
    onClick,
}: ModalProps): React.ReactElement {
    const [selectedMetadataState, setSelectedMetadataState] = React.useState<Record<number, Metadata[]>>({});
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
    const onClick_ = React.useCallback(() => onClick(selectedMetadataState), [onClick, selectedMetadataState]);

    return (
        <>
            <MetadataSelector
                metadata={metadata}
                metadataTypes={metadataTypes}
                onSelectChange={onSelectChange}
            />
            <Button onClick={onClick_} color={'primary'} variant={'contained'} >Submit</Button>
        </>
    );
}

export default Modal;
