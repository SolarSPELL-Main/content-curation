import React from 'react';
import MetadataEditor, { MetadataEditorActionProps } from './MetadataEditor';

import { Metadata, MetadataType } from '../../types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
} & MetadataEditorActionProps

/**
 * This component is the main modal for the metadata tab of the web app.
 * It allows metadata and metadata types to be added/edited/deleted.
 * @param props The context and callback for the modal.
 * @returns A form through which metadata and metadata types can be edited.
 */
function Modal({
    ...props
}: ModalProps): React.ReactElement {
    return (
        <MetadataEditor
            {...props}
        />
    );
}

export default Modal;
