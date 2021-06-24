import React from 'react';
import {
    KebabMenu as SolarSPELLKebabMenu,
    KebabMenuItem,
} from 'solarspell-react-lib';
import { MetadataType } from '../../types';

type KebabMenuActionProps = {
    onAdd: (type: MetadataType, val: string) => void
    onEditType: (type: MetadataType, val: string) => void
    onDeleteType: (type: MetadataType) => void
}

type KebabMenuProps = {
    metadataType: MetadataType
} & KebabMenuActionProps

/**
 * The kebab menu for the metadata editor.
 * This displays a menu for editing metadata types.
 * All dialogs are integrated as part of the menu items.
 * @param props The context and callbacks for the menu items.
 * @returns A clickable kebab menu icon.
 */
function KebabMenu({
    onAdd,
    onEditType,
    onDeleteType,
    metadataType,
}: KebabMenuProps): React.ReactElement {
    const onAdd_ = React.useCallback(
        (val: string) => onAdd(metadataType, val),
        [onAdd, metadataType],
    );
    const onEditType_ = React.useCallback(
        (val: string) => onEditType(metadataType, val),
        [onEditType, metadataType],
    );
    const onDeleteType_ = React.useCallback(
        (confirmation: string) => {
            if (confirmation === metadataType.name) {
                onDeleteType(metadataType);
            }
        },
        [onDeleteType, metadataType],
    );

    return (
        <SolarSPELLKebabMenu>
            <KebabMenuItem
                type={'text_input'}
                label={'Add Metadata'}
                onAction={onAdd_}
                textInputTitle={`Create a new Metadata of type ${metadataType.name}`}
                textInputLabel={'Metadata Name'}
                submitButtonText={'Create'}
            />
            <KebabMenuItem
                type={'text_input'}
                label={'Edit Metadata Type'}
                onAction={onEditType_}
                textInputTitle={`Edit Metadata Type ${metadataType.name}`}
                textInputLabel={'Metadata Type Name'}
                textInputSize={'xs'}
            />
            <KebabMenuItem
                type={'text_input'}
                label={'Delete Metadata Type'}
                onAction={onDeleteType_}
                textInputTitle={`Delete Metadata Type ${metadataType.name}`}
                textInputDescription={`WARNING: Deleting a metadata type will also delete all metadata of that type and is irreversible. Enter "${metadataType.name}" to confirm deletion`}
                textInputLabel={`Enter "${metadataType.name}" here to confirm deletion`}
                submitButtonColor={'secondary'}
                cancelButtonColor={'primary'}
                textInputSize={'md'}
            />
        </SolarSPELLKebabMenu>
    );
}

export type { KebabMenuActionProps };
export default KebabMenu;
