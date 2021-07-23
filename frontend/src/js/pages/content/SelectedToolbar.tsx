import React from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';

import ShowForPermission from '../ShowForPermission';
import DeleteSelected from './DeleteSelected';
import ClearSelected from './ClearSelected';

type SelectedToolbarActions = {
    onDelete: (ids: number[]) => void
    onClear: (ids: number[]) => void
}

type SelectedToolbarProps = {
    selected: number[]
    actions: SelectedToolbarActions
}

/**
 * This is a button that appears/disappears when selected is not empty.
 * It prompts the user if they are sure they want to delete selected content.
 * Collapse animation is to reduce jarring appearing/disappearing.
 * @param props Array of selected members and callback.
 * @returns A button to delete selected members of the content table.
 */
function SelectedToolbar({
    selected,
    actions,
}: SelectedToolbarProps): React.ReactElement {
    return (
        <Collapse in={selected.length > 0}>
            <Box mb={2} mt={2} display={'flex'}>
                <ShowForPermission slice={'content'} permission={'delete'}>
                    <Box>
                        <DeleteSelected
                            selected={selected}
                            onDelete={actions.onDelete}
                        />
                    </Box>
                </ShowForPermission>
                <Box>
                    <ClearSelected
                        selected={selected}
                        onClear={actions.onClear}
                    />
                </Box>
            </Box>
        </Collapse>
    );
}

export { SelectedToolbarActions };
export default SelectedToolbar;
