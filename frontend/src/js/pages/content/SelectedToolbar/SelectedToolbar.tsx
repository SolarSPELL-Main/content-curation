import React from 'react';

import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';

import { useCCSelector } from '../../../hooks';
import ShowForPermission from '../../ShowForPermission';
import DeleteSelected from './DeleteSelected';
import ClearSelected from './ClearSelected';
import ExportSelected from './ExportSelected';

/**
 * This is the toolbar that appears whenever the user makes a selection in
 * the DataGrid.
 * It appears only if the user has selected any content using the checkboxes
 * present in the content table.
 * Collapse animation to reduce jarring appearance/disappearance of toolbar.
 * @param props Context and callbacks of the toolbar. 
 * @returns An animated toolbar.
 */
function SelectedToolbar(): React.ReactElement {
    const selected = useCCSelector(state => state.content.selected);

    return (
        <Collapse in={selected.length > 0}>
            <Box mb={2} mt={2} display={'flex'}>
                <Box mr={2} >
                    <ClearSelected />
                </Box>
                <ShowForPermission slice={'content'} permission={'delete'}>
                    <Box mr={2} >
                        <DeleteSelected />
                    </Box>
                </ShowForPermission>
                <ShowForPermission slice={"special"} permission={"export"}>
                    <Box mr={2} >
                        <ExportSelected />
                    </Box>
                </ShowForPermission>
            </Box>
        </Collapse>
    );
}

export default SelectedToolbar;
