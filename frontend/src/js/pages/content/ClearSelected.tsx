import React from 'react';
import Button from '@material-ui/core/Button';

type ClearSelectedProps = {
    selected: number[]
    onClear: (content: number[]) => void
}

/**
 * This component shows the 'Clear selected' button below the search bar.
 * @param props Callback and context for the button.
 * @returns A button.
 */
function ClearSelected({
    selected,
    onClear,
}: ClearSelectedProps): React.ReactElement {
    return (
        <Button
            variant={'contained'}
            color={'primary'}
            onClick={() => onClear(selected)}
        >
            Clear Selection
        </Button>
    );
}

export default ClearSelected;
