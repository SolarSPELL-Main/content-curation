import React from 'react';

import Button from '@material-ui/core/Button';

import { useCCSelector } from '../../../hooks';
import { api, downloadFile } from '../../../utils/misc';
import APP_URLS from '../../../urls';

/**
 * This is the 'Export' button shown below the search bar when the user has
 * selected content.
 * It allows the user to download the selected content as a .zip file containing
 * the content in a CSV and the files associated with the content.
 * @returns The export button.
 */
function ExportSelected(): React.ReactElement {
  const selected = useCCSelector(state => state.content.selected);

  return (
    <Button
      variant={'contained'}
      color={'primary'}
      onClick={() => {
        const form = new FormData();
        form.set('content', JSON.stringify(selected));
        api.post(APP_URLS.EXPORT, form, {responseType: 'blob'})
          .then(res => {
            downloadFile(res.data, 'export.zip');
          });
      }}
    >
            Export
    </Button>
  );
}

export default ExportSelected;
