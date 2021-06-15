import React from 'react';
import MetadataEditor, { MetadataEditorActionProps } from './MetadataEditor';

import { Metadata, MetadataType } from '../../types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
} & MetadataEditorActionProps

function Modal(props: ModalProps): React.ReactElement {
    return (
        <MetadataEditor
            {...props}
        />
    );
}

export default Modal;
