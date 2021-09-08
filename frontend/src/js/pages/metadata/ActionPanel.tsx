import React from 'react';

import { Edit, Delete } from '@material-ui/icons';

import {
  ActionPanel as SolarSPELLActionPanel,
  ActionPanelItem,
} from 'solarspell-react-lib';
import * as Actions from '../../state/metadata';
import { useCCDispatch } from '../../hooks';
import ShowForPermission from '../ShowForPermission';
import { Metadata, MetadataType } from 'js/types';

/** Main props type */
type ActionPanelProps = {
    /** Metadata object associated with these actions */
    metadata: Metadata
    /** Metadata type associated with above metadata object */
    metadataType: MetadataType
}

/**
 * The 'Actions' column in the MetadataEditor component.
 * This component displays the icons for editing/deleting metadata.
 * @param props The metadata and metadata type associated with the actions.
 * @returns An action panel containing the Edit and Delete options for metadata.
 */
function ActionPanel({
  metadata,
  metadataType,
}: ActionPanelProps): React.ReactElement {
  const dispatch = useCCDispatch();

  return (
    <SolarSPELLActionPanel>
      <ShowForPermission slice={'metadata'} permission={'update'}>
        <ActionPanelItem
          type={'text_input'}
          tooltip={'Edit'}
          icon={Edit}
          onAction={name =>
            dispatch(Actions.edit_metadata({
              name: name,
              id: metadata.id,
            }))
          }
          textInputTitle={`Edit Metadata ${metadata.name}`}
          textInputLabel={'Metadata Name'}
          textInputDefaultValue={metadata.name}
          allowEnter
        />
      </ShowForPermission>
      <ShowForPermission slice={'metadata'} permission={'delete'}>
        <ActionPanelItem
          type={'confirm'}
          tooltip={'Delete'}
          icon={Delete}
          onAction={() =>
            dispatch(Actions.delete_metadata({
              type_id: metadata.metadataType.id,
              id: metadata.id,
              name: metadata.name,
            }))
          }
          confirmationTitle={`Delete Metadata item ${metadata.name} of type ${metadataType.name}?`}
          confirmationDescription={'WARNING: Deleting a metadata will also delete each of that metadata on every content and is irreversible.'}
        />
      </ShowForPermission>
    </SolarSPELLActionPanel>
  );
}

export default ActionPanel;
