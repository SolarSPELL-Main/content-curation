import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { ConfirmationDialog } from 'solarspell-react-lib';

type MetadataSubmitterProps = {
    onSubmit: () => void
}

/**
 * This component handles the submit button and its dialog.
 * @param props The callback on submitting.
 * @returns A button with an accompanying dialog.
 */
function MetadataSubmitter({
    onSubmit,
}: MetadataSubmitterProps): React.ReactElement {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const open = React.useCallback(() => setDialogOpen(true), [setDialogOpen]);
    const close = React.useCallback((val: boolean) => {
        setDialogOpen(false);
        if (val) {
            onSubmit();
        }
    }, [onSubmit, setDialogOpen]);

    return (
        <>
            <ConfirmationDialog
                open={dialogOpen}
                onClose={close}
                title={'Are you sure you would like to submit?'}
                size={'xs'}
                cancelColor={'secondary'}
                confirmColor={'primary'}
            />
            <Box mt={1}>
                <Button onClick={open} variant={'contained'} color={'primary'}>Submit</Button>
            </Box>
        </>
    );
}

export default MetadataSubmitter;
