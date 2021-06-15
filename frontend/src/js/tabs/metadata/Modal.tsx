import React from 'react';
import { TextInputDialog } from 'solarspell-react-lib';
import MetadataEditor, { MetadataEditorActionProps } from './MetadataEditor';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { Metadata, MetadataType } from '../../types';

type ModalProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onAddType: (typeName: string) => void
} & MetadataEditorActionProps

function Modal({
    onAddType,
    ...props
}: ModalProps): React.ReactElement {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const open = React.useCallback(() => setDialogOpen(true), [setDialogOpen]);
    const close = React.useCallback((val: string) => {
        setDialogOpen(false);
        if (val) {
            onAddType(val);
        }
    }, [onAddType, setDialogOpen]);

    return (
        <Box p={2}>
            <TextInputDialog
                open={dialogOpen}
                onClose={close}
                title={'Enter new Metadata Type name'}
                label={'New Metadata Type name'}
            />
            <Box mb={1}>
                <Button onClick={open} variant={'contained'} color={'primary'}>Add Type</Button>
            </Box>
            <MetadataEditor
                {...props}
            />
        </Box>
    );
}

export default Modal;
