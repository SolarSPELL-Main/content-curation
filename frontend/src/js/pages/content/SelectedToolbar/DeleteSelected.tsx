import React from 'react';

import Button from '@material-ui/core/Button';

import { ConfirmationDialog } from 'solarspell-react-lib';
import * as Actions from '../../../state/content';
import { useCCDispatch, useCCSelector } from '../../../hooks';

/**
 * This is the 'Delete' button that shows below the search bar when the user
 * has selected content.
 * It prompts the user if they are sure they want to delete selected content.
 * If agreed, the user's selected content will all be deleted.
 * @returns A button to delete selected members of the content table.
 */
function DeleteSelected(): React.ReactElement {
  const dispatch = useCCDispatch();
  const selected = useCCSelector(state => state.content.selected);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ConfirmationDialog
        open={open}
        // Plural shown for when # items != 1
        title={`Delete ${selected.length} selected ${
          selected.length === 1 ? 'item' : 'items'
        }?`}
        size={'xs'}
        onClose={agreed => {
          // On agree, dispatch action to delete all selected content
          if (agreed) {
            // To avoid dealing with pages that no longer exist,
            // reset user back to first page.
            dispatch(Actions.update_pagination({
              page: 0,
            }));
            dispatch(Actions.delete_content(selected));
          }
          setOpen(false);
        }}
      />
      <Button
        variant={'contained'}
        color={'secondary'}
        onClick={() => setOpen(true)}
      >
                Delete
      </Button>
    </>
  );
}

export default DeleteSelected;
