import React from 'react';
import Box from '@material-ui/core/Box';
import { MetadataDisplay } from 'solarspell-react-lib';
import MetadataKebabMenu, { MetadataKebabMenuActionProps } from './MetadataKebabMenu';
import MetadataActionPanel, { MetadataActionPanelActionProps } from './MetadataActionPanel';
import MetadataTypeAdder, { MetadataTypeAdderActionProps } from './MetadataTypeAdder';

import { Metadata, MetadataType } from '../../types';

type MetadataEditorActionProps = {
    actions: {
        KebabMenu: MetadataKebabMenuActionProps
        ActionPanel: MetadataActionPanelActionProps
        AddType: MetadataTypeAdderActionProps
    }
}

type MetadataEditorProps = {
    metadata: Record<number, Metadata[]>
    metadataTypes: MetadataType[]
} & MetadataEditorActionProps

/**
 * This component handles the editing of metadata types and metadata.
 * @param props The context and various actions for the menus.
 * @returns A box containing a button for adding and accordions for all metadata types and metadata with additional menus.
 */
function MetadataEditor({
    metadata,
    metadataTypes,
    actions,
}: MetadataEditorProps): React.ReactElement {
    return (
        <Box p={2}>
            <MetadataTypeAdder
                onAddType={actions.AddType.onAddType}
            />
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
        </Box>
    );
}

export type { MetadataEditorActionProps };
export default MetadataEditor;
