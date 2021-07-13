//Importing from outside the project
import React from 'react';
import { Edit, Delete, Visibility } from '@material-ui/icons';

//Importing from other files in the project
import {
  ActionPanel as SolarSPELLActionPanel,
  ActionPanelItem,
} from 'solarspell-react-lib';
import ShowForPermission from '../ShowForPermission';
import { Content } from 'js/types';

type ActionPanelProps = {
  onEdit: (item: Content, vals?: Partial<Content>) => void
  onDelete: (item: Content) => void
  onView: (item: Content) => void
  content: Content
}

/**
 * Action panel for viewing/editing content.
 * @param props The callbacks + context of the action panel.
 * @returns The action panel.
 */
function ActionPanel({
  onEdit,
  onDelete,
  onView,
  content,
}: ActionPanelProps): React.ReactElement {
  const onEdit_ = React.useCallback(
    () => onEdit(content),
    [onEdit, content],
  );

  const onDelete_ = React.useCallback(
    () => onDelete(content),
    [onDelete, content],
  );

  const onView_ = React.useCallback(
    () => onView(content),
    [onView, content],
  );

  return (
    <SolarSPELLActionPanel>
      <ShowForPermission slice={'content'} permission={'update'}>
        <ActionPanelItem
          type={'button'}
          icon={Edit}
          onAction={onEdit_}
          tooltip={'Edit Content'}
        />
      </ShowForPermission>
      <ShowForPermission slice={'content'} permission={'delete'}>
        <ActionPanelItem
          type={'confirm'}
          icon={Delete}
          confirmationTitle={`Delete content titled "${content.title}"?`}
          onAction={onDelete_}
          tooltip={'Delete'}
          confirmationSize={'xs'}
        />
      </ShowForPermission>
      <ShowForPermission slice={'content'} permission={'read'}>
        <ActionPanelItem
          type={'button'}
          icon={Visibility}
          onAction={onView_}
        />
      </ShowForPermission>
    </SolarSPELLActionPanel>
  );
}

export default ActionPanel;
