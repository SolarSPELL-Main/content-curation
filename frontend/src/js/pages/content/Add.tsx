//Importing from outside the project
import React from 'react';
import Button from '@material-ui/core/Button';

//Importing from other files in the project
import ContentForm from './ContentForm';
import { Metadata, MetadataType, Content } from 'js/types';

type AddProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onAdd: (content?: Content) => void
    onCreate: (
        metadataType: MetadataType,
        newTags: Metadata[],
    ) => Promise<Metadata[]>
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
    onCreate,
}: AddProps): React.ReactElement {
    const [open, setOpen] = React.useState(false);
    const onSubmit_ = React.useCallback(
        (content?: Partial<Content>) => {
            setOpen(false);
            onAdd(content ? content as Content : undefined);
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
                onCreate={onCreate}
                open={open}
                type={'add'}
            />
        </>
    );
}

export default Add;
