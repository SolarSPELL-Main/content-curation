import React from 'react';

import {
  KebabMenu as SolarSPELLKebabMenu,
  KebabMenuItem,
} from 'solarspell-react-lib';
import * as Actions from '../../state/metadata';
import { useCCDispatch } from '../../hooks';
import APP_URLS from '../../urls';
import ShowForPermission from '../ShowForPermission';
import { MetadataType } from 'js/types';

/** Main props type */
type KebabMenuProps = {
    /** Metadata type associated with this kebab menu */
    metadataType: MetadataType
}

/**
 * The kebab menu displayed in the top right of each metadata type.
 * This displays a menu for editing metadata types.
 * All dialogs are integrated as part of the menu items.
 * @param props The metadata type associated with the menu.
 * @returns A clickable kebab menu icon.
 */
function KebabMenu({
  metadataType,
}: KebabMenuProps): React.ReactElement {
  const dispatch = useCCDispatch();

  return (
    <ShowForPermission
      slice={'metadata'}
      permission={[
        'create',
        'update',
        'delete',
      ]}
      mode={'some'}
    >
      <SolarSPELLKebabMenu>
        <ShowForPermission slice={'metadata'} permission={'create'}>
          <KebabMenuItem
            type={'text_input'}
            label={'Add Metadata'}
            onAction={name =>
              dispatch(Actions.add_metadata({
                name: name,
                type_id: metadataType.id,
              }))
            }
            textInputTitle={`Create a new Metadata of type ${metadataType.name}`}
            textInputLabel={'Metadata Name'}
            submitButtonText={'Create'}
            allowEnter
          />
        </ShowForPermission>
        <ShowForPermission slice={'metadata'} permission={'update'}>
          <KebabMenuItem
            type={'text_input'}
            label={'Edit Metadata Type'}
            onAction={name => 
              dispatch(Actions.edit_metadatatype({
                name: name,
                type_id: metadataType.id,
              }))
            }
            textInputTitle={`Edit Metadata Type ${metadataType.name}`}
            textInputLabel={'Metadata Type Name'}
            textInputDefaultValue={metadataType.name}
            textInputSize={'xs'}
            allowEnter
          />
        </ShowForPermission>
        <ShowForPermission slice={'metadata'} permission={'delete'}>
          <KebabMenuItem
            type={'text_input'}
            label={'Delete Metadata Type'}
            onAction={confirmation => {
              if (confirmation === metadataType.name) {
                dispatch(Actions.delete_metadatatype({
                  type_id: metadataType.id,
                  name: metadataType.name,
                }));
              }
            }}
            textInputTitle={`Delete Metadata Type ${metadataType.name}`}
            textInputDescription={`WARNING: Deleting a metadata type will also delete all metadata of that type and is irreversible. Enter "${metadataType.name}" to confirm deletion`}
            textInputLabel={`Enter "${metadataType.name}" here to confirm deletion`}
            submitButtonColor={'secondary'}
            cancelButtonColor={'primary'}
            textInputSize={'md'}
          />
        </ShowForPermission>
        <ShowForPermission slice={'special'} permission={'export'}>
          <KebabMenuItem
            type={'button'}
            label={'Export as CSV'}
            onAction={() =>
              window.open(
                APP_URLS.METADATA_TYPE_EXPORT(metadataType.id),
              )
            }
          />
        </ShowForPermission>
      </SolarSPELLKebabMenu>
    </ShowForPermission>
  );
}

export default KebabMenu;
