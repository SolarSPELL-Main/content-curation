import React from 'react';

import { Edit, Delete, Visibility } from '@material-ui/icons';

import {
  ActionPanel as SolarSPELLActionPanel,
  ActionPanelItem,
} from 'solarspell-react-lib';
import * as ContentActions from '../../state/content';
import { useCCDispatch } from '../../hooks';
import { Content } from 'js/types';

/** Main props type */
type ActionPanelProps = {
  /** Content associated with these actions */
  content: Content
  /** Callback on clicking the 'edit' icon */
  onEdit: (content: Content) => void
  /** Callback on clicking the 'view' icon */
  onView: (content: Content) => void
  /** Whether to show edit icon */
  showEdit?: boolean | ((content: Content) => boolean)
  /** Whether to show delete icon */
  showDelete?: boolean | ((content: Content) => boolean)
  /** Whether to show view icon */
  showView?: boolean | ((content: Content) => boolean)
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

  // NOTE: The edit/view actions are lifted into Table.tsx for performance
  //       reasons. Rendering a single ContentForm/Viewer is faster than
  //       rendering one for each row of the table.
  //       If needed, the same philosophy can be applied to the dialogs
  //       associated with the ActionPanelItems here and in the metadata tab.
  return (
    <SolarSPELLActionPanel>
      {((showEdit instanceof Function) ?
        showEdit(content) : showEdit) &&
      <ActionPanelItem
        type={'button'}
        icon={Edit}
        onAction={() => onEdit(content)}
        tooltip={'Edit Content'}
      />}
      {((showDelete instanceof Function) ?
        showDelete(content) : showDelete) &&
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
      />}
      {((showView instanceof Function) ?
        showView(content) : showView) &&
      <ActionPanelItem
        type={'button'}
        icon={Visibility}
        onAction={() => onView(content)}
      />}
    </SolarSPELLActionPanel>
  );
}

export default ActionPanel;
