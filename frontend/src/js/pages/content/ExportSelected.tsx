import React from 'react';
import Button from '@material-ui/core/Button';

type ExportSelectedProps = {
    selected: number[]
    onExport: (content: number[]) => void
}

function ExportSelected({
    selected,
    onExport,
}: ExportSelectedProps): React.ReactElement {
    return (
        <Button
            variant={'contained'}
            color={'primary'}
            onClick={() => onExport(selected)}
        >
            Export
        </Button>
    )
}

export default ExportSelected;
