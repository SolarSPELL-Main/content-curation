//Importing from outside the project
import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

//Importing from other files in the project
import ContentForm from './ContentForm';
import { Metadata, MetadataType, Content } from 'js/types';

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
        (content?: Partial<Content>) => {
            setOpen(false);
            if (content) {
                onAdd(content as Content);
            }
        },
        [onAdd, setOpen],
    );

    return (
        <Box mb={1}>
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
        </Box>
    );
}

export default Add;
