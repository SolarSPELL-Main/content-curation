//Importing from outside the project
import React from 'react';
import Button from '@material-ui/core/Button';

//Importing from other files in the project
import * as ContentActions from '../../../state/content';
import * as MetadataActions from '../../../state/metadata';
import { useCCDispatch } from '../../../hooks';
import ContentForm from '../ContentForm';
import { Content } from 'js/types';

/**
 * Button for adding a piece of content.
 * Displayed in top left of content tab.
 * @returns A button for opening a dialog to add content.
 */
function Add(): React.ReactElement {
    const dispatch = useCCDispatch();
    const [open, setOpen] = React.useState(false);

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
                onSubmit={content => {
                    if (content) {
                        // Cast Partial to Content since assumes validation
                        // takes care of required fields
                        dispatch(ContentActions.add_content(content as Content));
                    }
        
                    // Clear newly added
                    dispatch(MetadataActions.update_newly_added([]));
                }}
                open={open}
                type={'add'}
            />
        </>
    );
}

export default Add;
