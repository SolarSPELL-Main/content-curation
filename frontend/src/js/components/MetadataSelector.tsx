import React from 'react';
import { MetadataDisplay } from 'solarspell-react-lib';
import { Metadata, MetadataType } from '../types';

import MetadataKebabMenu, { MetadataKebabMenuActionProps } from './MetadataKebabMenu';
import MetadataActionPanel, { MetadataActionPanelActionProps } from './MetadataActionPanel';

type MetadataSelectorProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
    kebabMenuActions: MetadataKebabMenuActionProps
    actionPanelActions: MetadataActionPanelActionProps
}

function MetadataSelector({
    metadata,
    metadataTypes,
    kebabMenuActions,
    actionPanelActions,
}: MetadataSelectorProps): React.ReactElement {
    return (
        <MetadataDisplay
            metadata={metadata}
            metadataTypes={metadataTypes}
            tableActionProps={{
                components: {
                    KebabMenu: MetadataKebabMenu,
                    ActionPanel: MetadataActionPanel,
                },
                componentProps: {
                    KebabMenu: kebabMenuActions,
                    ActionPanel: actionPanelActions,
                },
            }}
        />
    );
}

export default MetadataSelector;
