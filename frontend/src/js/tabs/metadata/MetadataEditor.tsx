import React from 'react';
import { MetadataDisplay } from 'solarspell-react-lib';
import MetadataKebabMenu, { MetadataKebabMenuActionProps } from './MetadataKebabMenu';
import MetadataActionPanel, { MetadataActionPanelActionProps } from './MetadataActionPanel';

import { Metadata, MetadataType } from '../../types';

type MetadataEditorActionProps = {
    actions: {
        KebabMenu: MetadataKebabMenuActionProps
        ActionPanel: MetadataActionPanelActionProps
    }
}

type MetadataEditorProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
} & MetadataEditorActionProps

function MetadataEditor({
    metadata,
    metadataTypes,
    actions,
}: MetadataEditorProps): React.ReactElement {
    return (
        <MetadataDisplay
            metadata={metadata}
            metadataTypes={metadataTypes}
            tableProps={{
                components: {
                    KebabMenu: MetadataKebabMenu,
                    ActionPanel: MetadataActionPanel,
                },
                componentProps: {
                    KebabMenu: actions.KebabMenu,
                    ActionPanel: actions.ActionPanel,
                },
            }}
        />
    );
}

export type { MetadataEditorActionProps };
export default MetadataEditor;
