import React from 'react';
import Button from '@material-ui/core/Button';
import ContentForm from './ContentForm';

import { Metadata, MetadataType, Content } from '../../types';

type AddProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onAdd: (content: Content) => void
}

/**
 * Button for adding a piece of content.
 * @props Callbacks + associated metadata.
 * @returns A button for opening a dialog to add content.
 */
function Add({
    metadata,
    metadataTypes,
    onAdd,
}: AddProps): React.ReactElement {
    const [open, setOpen] = React.useState(false);
    const onSubmit_ = React.useCallback(
        (content?: Content) => {
            setOpen(false);
            if (content) {
                onAdd(content);
            }
        },
        [onAdd, setOpen],
    );

    return (
        <>
            <Button
                variant={'contained'}
                color={'primary'}
                onClick={() => setOpen(true)}
            >
                Add Content
            </Button>
            <ContentForm
                metadata={metadata}
                metadataTypes={metadataTypes}
                onSubmit={onSubmit_}
                open={open}
                type={'add'}
            />
        </>
    );
}

export default Add;
