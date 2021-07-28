import React from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';

import ShowForPermission from '../ShowForPermission';
import DeleteSelected from './DeleteSelected';
import ClearSelected from './ClearSelected';
import {Button} from '@material-ui/core';
import APP_URLS from '../../urls';

type SelectedToolbarActions = {
    onDelete: (ids: number[]) => void
    onClear: (ids: number[]) => void
}

type SelectedToolbarProps = {
    selected: number[]
    actions: SelectedToolbarActions
}

/**
 * This is the toolbar that appears whenever the user makes a selection in
 * the DataGrid.
 * Collapse animation to reduce jarring appearance/disappearance of toolbar.
 * @param props Context and callbacks of the toolbar. 
 * @returns An animated toolbar.
 */
function SelectedToolbar({
    selected,
    actions,
}: SelectedToolbarProps): React.ReactElement {
    return (
        <Collapse in={selected.length > 0}>
            <Box mb={2} mt={2} display={'flex'}>
                <Box>
                    <ClearSelected
                        selected={selected}
                        onClear={actions.onClear}
                    />
                </Box>
                <ShowForPermission slice={'content'} permission={'delete'}>
                    <Box>
                        <DeleteSelected
                            selected={selected}
                            onDelete={actions.onDelete}
                        />
                    </Box>
                </ShowForPermission>
                <ShowForPermission slice={"special"} permission={"export"}>
                    <Box>
                        <Button onClick={() => {
                            window.open(APP_URLS.EXPORT(selected[0]))
                        }}>EXPORT</Button>
                    </Box>
                </ShowForPermission>
            </Box>
        </Collapse>
    );
}

export { SelectedToolbarActions };
export default SelectedToolbar;
