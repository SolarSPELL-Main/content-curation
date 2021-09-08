import React from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { TextInputDialog } from 'solarspell-react-lib';
import * as Actions from '../../state/metadata';
import { useCCDispatch } from '../../hooks';

/**
 * This component handles the adding of new metadata types and its dialog.
 * It is displayed is the 'Add Type' button.
 * @returns A button with an accompanying dialog.
 */
function TypeAdder(): React.ReactElement {
  const dispatch = useCCDispatch();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <TextInputDialog
        open={dialogOpen}
        onClose={name => {
          setDialogOpen(false);
          if (name) {
            dispatch(Actions.add_metadatatype({
              name: name,
            }));
          }
        }}
        title={'Enter new Metadata Type name'}
        label={'New Metadata Type name'}
        allowEnter
      />
      <Box mb={1}>
        <Button
          onClick={() => setDialogOpen(true)}
          variant={'contained'}
          color={'primary'}
        >
                    Add Type
        </Button>
      </Box>
    </>
  );
}

export default TypeAdder;
