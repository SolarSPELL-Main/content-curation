import React from 'react';

import { Edit, Delete, Visibility } from '@material-ui/icons';

import {
  ActionPanel as SolarSPELLActionPanel,
  ActionPanelItem,
} from 'solarspell-react-lib';
import * as ContentActions from '../../state/content';
import * as MetadataActions from '../../state/metadata';
import { useCCDispatch } from '../../hooks';
import ShowForPermission from '../ShowForPermission';
import ContentForm from './ContentForm';
import Viewer from './Viewer';
import { Content } from 'js/types';

type ActionPanelProps = {
  content: Content
}

/**
 * This component renders the icons displayed in the 'Actions' column of the
 * table. It also implements its corresponding functionality.
 * The associated icons allow for editing, deleting, and viewing content.
 * @param props The content associated with the actions.
 * @returns The action panel.
 */
function ActionPanel({
  content,
}: ActionPanelProps): React.ReactElement {
  const dispatch = useCCDispatch();
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);

  return (
    <SolarSPELLActionPanel>
      <ShowForPermission slice={'content'} permission={'update'}>
        <ActionPanelItem
          type={'button'}
          icon={Edit}
          onAction={() => setEditOpen(true)}
          tooltip={'Edit Content'}
        />
        <ContentForm
          open={editOpen}
          onSubmit={newContent => {
            setEditOpen(false);
            if (newContent) {
              newContent.id = content.id;
              dispatch(ContentActions.edit_content(newContent as Content));
            }

            // Clear newly added
            dispatch(MetadataActions.update_newly_added([]));
          }}
          content={content}
          type={'edit'}
        />
      </ShowForPermission>
      <ShowForPermission slice={'content'} permission={'delete'}>
        <ActionPanelItem
          type={'confirm'}
          icon={Delete}
          confirmationTitle={`Delete content titled "${content.title}"?`}
          onAction={() => {
            // To avoid dealing with pages that no longer exist
            dispatch(ContentActions.update_pagination({
              page: 0,
            }));

            dispatch(ContentActions.delete_content(content.id));
          }}
          tooltip={'Delete'}
          confirmationSize={'xs'}
        />
      </ShowForPermission>
      <ShowForPermission slice={'content'} permission={'read'}>
        <ActionPanelItem
          type={'button'}
          icon={Visibility}
          onAction={() => setViewOpen(true)}
        />
        <Viewer
          open={viewOpen}
          content={content}
          onClose={() => setViewOpen(false)}
        />
      </ShowForPermission>
    </SolarSPELLActionPanel>
  );
}

export default ActionPanel;
