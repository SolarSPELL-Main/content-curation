//Importing from outside the project
import React from 'react';

//Importing from other files in the project
import Add from './Add';
import Display, { DisplayActionProps } from './Display';
import { Content, Metadata, MetadataType } from 'js/types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    content: Content[]
    actions: {
        Display: DisplayActionProps
        Toolbar: {
            onAdd: (content: Partial<Content>) => void
        }
    }
}

function Modal({
    metadata,
    metadataTypes,
    content,
    actions,
}: ModalProps): React.ReactElement {
    return (<>
        <Add
            metadata={metadata}
            metadataTypes={metadataTypes}
            onAdd={actions.Toolbar.onAdd}
        />
        <Display
            metadata={metadata}
            metadataTypes={metadataTypes}
            content={content}
            actions={actions.Display}
        />
    </>);
}

export default Modal;
