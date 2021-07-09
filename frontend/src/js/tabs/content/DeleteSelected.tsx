import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';

import { ConfirmationDialog } from 'solarspell-react-lib';
import { Content } from 'js/types';

type DeleteSelectedProps = {
    selected: Content[]
    onDelete: (content: Content[]) => void
}

/**
 * This is a button that appears/disappears when selected is not empty.
 * It prompts the user if they are sure they want to delete selected content.
 * @param props Array of selected members and callback.
 * @returns A button to delete selected members of the content table.
 */
function DeleteSelected({
    selected,
    onDelete,
}: DeleteSelectedProps): React.ReactElement {
    const [open, setOpen] = React.useState(false);

    const openDialog = React.useCallback(
        () => setOpen(true),
        [setOpen],
    );

    const closeDialog = React.useCallback(
        (agreed: boolean) => {
            if (agreed) {
                onDelete(selected);
            }
            setOpen(false);
        },
        [onDelete, selected, setOpen],
    );

    return (
        <Collapse in={selected.length > 0}>
            <Box mb={2} mt={2}>
                <ConfirmationDialog
                    open={open}
                    title={'Delete ALL selected content?'}
                    size={'xs'}
                    onClose={closeDialog}
                />
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={openDialog}
                >Delete selected</Button>
            </Box>
        </Collapse>
    );
}

export default DeleteSelected;
