import React from 'react';

import prettyBytes from 'pretty-bytes';

import { ContentViewer } from 'solarspell-react-lib';
import { useCCSelector } from '../../hooks';
import { Content } from 'js/types';

/** Main props type */
type ViewerProps = {
    /** Content to display */
    content: Content
    /** Whether the dialog is open */
    open: boolean
    /** Callback on dialog close */
    onClose: () => void
}

/**
 * Boilerplate implementation of ContentViewer.
 * @param props Context and callbacks of content view.
 * @returns A dialog displaying information about a single piece of content.
 */
function Viewer(props: ViewerProps): React.ReactElement {
  const metadataTypes = useCCSelector(state => state.metadata.metadata_types);
  const copyrights = useCCSelector(state => state.copyright.copyright);

  return (
    <ContentViewer
      {...props}
      metadataTypes={metadataTypes}
      fields={[
        {
          title: 'Title',
          field: 'title',
        },
        {
          title: 'Description',
          field: 'description',
        },
        {
          title: 'Filename',
          field: 'fileName',
        },
        {
          title: 'Filesize',
          field: 'filesize',
          formatter: (val: number) => prettyBytes(val),
        },
        {
          title: 'Original Source',
          field: 'originalSource',
        },
        {
          title: 'Created On',
          field: 'createdDate',
        },
        {
          title: 'Created By',
          field: 'creator',
        },
        {
          title: 'Year of Publication',
          field: 'datePublished',
        },
        {
          title: 'Status',
          field: 'status',
        },
        {
          title: 'Reviewed Date',
          field: 'reviewedDate',
        },
        {
          title: 'Reviewed By',
          field: 'reviewer',
        },
        {
          title: 'Copyright',
          field: 'copyright',
            formatter: (val: number) => copyrights
                .find(copy => copy.id === val)?.description || val
        },
        {
          title: 'Copyright Notes',
          field: 'copyright_notes',
        },
        {
          title: 'Additional Notes',
          field: 'notes',
        },
      ]}
      fileDisplay={{
        field: 'fileURL',
        formatter: (url: string) => (
          <object
            width={600}
            height={600}
            data={new URL(url).href}
          >
            <i>File display</i>
          </object>
        ),
      }}
    />
  );
}

export default Viewer;
