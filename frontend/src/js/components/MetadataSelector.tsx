import React from 'react';
import { GridSelectionModelChangeParams } from '@material-ui/data-grid';
import { MetadataDisplay, BaseMetadata, BaseMetadataType } from 'solarspell-react-lib';
import { Metadata, MetadataType } from '../types';

import MetadataKebabMenu, { MetadataKebabMenuActionProps } from './MetadataKebabMenu';

type MetadataSelectorProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    kebabMenuActions: MetadataKebabMenuActionProps
    onSelectChange: (metadata: BaseMetadata[], metadataType: BaseMetadataType, rows: GridSelectionModelChangeParams) => void
}

function MetadataSelector({
    metadata,
    metadataTypes,
    kebabMenuActions,
    onSelectChange,
}: MetadataSelectorProps): React.ReactElement {
    return (
        <MetadataDisplay
            metadata={metadata}
            metadataTypes={metadataTypes}
            tableProps={{
                components: {
                    KebabMenu: MetadataKebabMenu,
                },
                componentProps: {
                    KebabMenu: kebabMenuActions,
                },
                selectable: true,
                onSelectChange: onSelectChange,
            }}
        />
    );
}

export default MetadataSelector;
