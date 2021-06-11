import React from 'react';
import MetadataSelector from '../../components/MetadataSelector';
import Button from '@material-ui/core/Button';

import { Metadata, MetadataType } from '../../types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onClick: (metadata: Record<number, Metadata[]>) => void
}

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
                kebabMenuActions={{
                    onAdd: console.log,
                    onDeleteType: console.log,
                    onEditType: console.log,
                }}
                onSelectChange={onSelectChange}
            />
            <Button onClick={onClick_} color={'primary'} variant={'contained'} >Submit</Button>
        </>
    );
}

export default Modal;
