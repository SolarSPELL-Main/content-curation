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

/**
 * This component handles the editing of metadata types and metadata (excluding adding metadata types).
 * @param props The context and various actions for the menus.
 * @returns An accordion containing all metadata types and metadata with additional menus.
 */
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
