import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { TextInputDialog } from 'solarspell-react-lib';

type MetadataTypeAdderActionProps = {
    onAddType: (typeName: string) => void
}

type MetadataTypeAdderProps = MetadataTypeAdderActionProps

/**
 * This component handles the adding of new metadata types and its dialogs.
 * @param props The callback on adding a new type.
 * @returns A button with an accompanying dialog.
 */
function MetadataTypeAdder({
    onAddType,
}: MetadataTypeAdderProps): React.ReactElement {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const open = React.useCallback(() => setDialogOpen(true), [setDialogOpen]);
    const close = React.useCallback((val: string) => {
        setDialogOpen(false);
        if (val) {
            onAddType(val);
        }
    }, [onAddType, setDialogOpen]);

    return (
        <>
            <TextInputDialog
                open={dialogOpen}
                onClose={close}
                title={'Enter new Metadata Type name'}
                label={'New Metadata Type name'}
            />
            <Box mb={1}>
                <Button onClick={open} variant={'contained'} color={'primary'}>Add Type</Button>
            </Box>
        </>
    );
}

export type { MetadataTypeAdderActionProps };
export default MetadataTypeAdder;
