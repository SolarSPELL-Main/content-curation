import React from 'react';

import { Edit, Delete, Visibility } from '@material-ui/icons';

import {
  ActionPanel as SolarSPELLActionPanel,
  ActionPanelItem,
} from 'solarspell-react-lib';
import * as ContentActions from '../../state/content';
import { useCCDispatch } from '../../hooks';
import { Content } from 'js/types';

type ActionPanelProps = {
  content: Content
  onEdit: (content: Content) => void
  onView: (content: Content) => void
  showEdit?: boolean
  showDelete?: boolean
  showView?: boolean
}

/**
 * This component renders the icons displayed in the 'Actions' column of the
 * table. It also implements its corresponding functionality.
 * The associated icons allow for editing, deleting, and viewing content.
 * @param props The content and callbacks associated with the actions.
 * @returns The action panel.
 */
function ActionPanel({
  content,
  onEdit,
  onView,
  showEdit=true,
  showDelete=true,
  showView=true,
}: ActionPanelProps): React.ReactElement {
  const dispatch = useCCDispatch();

  return (
    <SolarSPELLActionPanel>
      {showEdit && <ActionPanelItem
        type={'button'}
        icon={Edit}
        onAction={() => onEdit(content)}
        tooltip={'Edit Content'}
      />}
      {showDelete && <ActionPanelItem
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
      />}
      {showView && <ActionPanelItem
        type={'button'}
        icon={Visibility}
        onAction={() => onView(content)}
      />}
    </SolarSPELLActionPanel>
  );
}

export default ActionPanel;
