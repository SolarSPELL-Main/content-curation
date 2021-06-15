import React from 'react';
import { GridSelectionModelChangeParams } from '@material-ui/data-grid';
import { MetadataDisplay, BaseMetadata, BaseMetadataType } from 'solarspell-react-lib';
import { Metadata, MetadataType } from '../../types';

type MetadataSelectorProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    onSelectChange: (metadata: BaseMetadata[], metadataType: BaseMetadataType, rows: GridSelectionModelChangeParams) => void
}

function MetadataSelector({
    metadata,
    metadataTypes,
    onSelectChange,
}: MetadataSelectorProps): React.ReactElement {
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

export default MetadataSelector;
