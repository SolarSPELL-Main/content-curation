import React from 'react';
import {
  ActionPanel as SolarSPELLActionPanel,
  ActionPanelItem,
} from 'solarspell-react-lib';
import { Edit, CheckCircleOutline, HighlightOff, Visibility } from '@material-ui/icons';

import { Content } from 'js/types';

type ActionPanelProps = {
  onEdit: (item: Content, vals?: Partial<Content>) => void
  onToggleActive: (item: Content, active: boolean) => void
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
  onToggleActive,
  onView,
  content,
}: ActionPanelProps): React.ReactElement {
  const onEdit_ = React.useCallback(
    () => onEdit(content),
    [onEdit, content],
  );

  const onToggleActive_ = React.useCallback(
    (active, setActive) => {
      onToggleActive(content, active);
      // Dispatch value change for ActionPanelItem
      setActive(active);
    },
    [onToggleActive, content],
  );

  const onView_ = React.useCallback(
    () => onView(content),
    [onView, content],
  );

  return (
    <SolarSPELLActionPanel>
      <ActionPanelItem
        type={'button'}
        icon={Edit}
        onAction={onEdit_}
        tooltip={'Edit Content'}
      />
      <ActionPanelItem
        type={'toggle'}
        activeIcon={HighlightOff}
        inactiveIcon={CheckCircleOutline}
        toggle={onToggleActive_}
        tooltip={content.active ? 'Set inactive' : 'Set active'}
        active={content.active}
      />
      <ActionPanelItem
        type={'button'}
        icon={Visibility}
        onAction={onView_}
      />
    </SolarSPELLActionPanel>
  );
}

export default ActionPanel;
