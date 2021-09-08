import React from 'react';

import Button from '@material-ui/core/Button';

import * as Actions from '../../../state/content';
import { useCCDispatch } from '../../../hooks';

/**
 * This component shows the 'Clear selected' button below the search bar.
 * It clears the user's current selected Content.
 * @returns A button.
 */
function ClearSelected(): React.ReactElement {
  const dispatch = useCCDispatch();

  return (
    <Button
      variant={'contained'}
      color={'primary'}
      onClick={() => dispatch(Actions.clear_selected())}
    >
            Clear Selection
    </Button>
  );
}

export default ClearSelected;
