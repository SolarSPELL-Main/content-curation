import React from 'react';
import { GridSelectionModelChangeParams } from '@material-ui/data-grid';
import { MetadataDisplay, BaseMetadata, BaseMetadataType } from 'solarspell-react-lib';
import { Metadata, MetadataType } from '../../types';

type SelectorProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onSelectChange: (metadata: BaseMetadata[], metadataType: BaseMetadataType, 
                        rows: GridSelectionModelChangeParams) => void
}

/**
 * Displays all metadata with checkable boxes.
 * This component allows curators to select relevant metadata.
 * @param props The data to pass in and the selection callback.
 * @returns An accordion to display all metadata with checkable boxes.
 */
function Selector({
    metadata,
    metadataTypes,
    onSelectChange,
}: SelectorProps): React.ReactElement {
    return (
        <MetadataDisplay
            metadata={metadata}
            metadataTypes={metadataTypes}
            tableProps={{
                selectable: true,
                onSelectChange: onSelectChange,
            }}
        />
    );
}

export default Selector;
