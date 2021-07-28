import React from 'react';
import Button from '@material-ui/core/Button';

import { ConfirmationDialog } from 'solarspell-react-lib';

type DeleteSelectedProps = {
    selected: number[]
    onDelete: (content: number[]) => void
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
        <>
            <ConfirmationDialog
                open={open}
                title={`Delete ${selected.length} selected ${
                    selected.length == 1 ? 'item' : 'items'
                }?`}
                size={'xs'}
                onClose={closeDialog}
            />
            <Button
                variant={'contained'}
                color={'secondary'}
                onClick={openDialog}
            >
                Delete
            </Button>
        </>
    );
}

export default DeleteSelected;
