import React from 'react';

import { ContentViewer } from 'solarspell-react-lib';
import { MetadataType, Content } from 'js/types';

type ViewerProps = {
    content: Content
    metadataTypes: MetadataType[]
    open: boolean
    onClose: () => void
}

/**
 * Boilerplate implementation of ContentViewer.
 * @param props Context and callbacks of content view.
 * @returns A dialog displaying information about a single piece of content.
 */
function Viewer(props: ViewerProps): React.ReactElement {
    return (
        <ContentViewer
            {...props}
            items={[
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
                    title: 'Created On',
                    field: 'createdDate',
                },
                {
                    title: 'Year of Publication',
                    field: 'datePublished',
                },
                {
                    title: 'Copyright Approved',
                    field: 'copyrightApproved',
                    formatter: (b: boolean) => b ? 'Yes' : 'No',
                },
                {
                    title: 'Copyright Notes',
                    field: 'copyright',
                },
                {
                    title: 'Rights Statement',
                    field: 'rightsStatement',
                },
                {
                    title: 'Additional Notes',
                    field: 'notes',
                },
            ]}
            fileDisplay={{
                field: 'fileURL',
                // Currently unused
                    formatter: (url: string) => {
                        console.log(url)
                        return (
                    <object
                        width={600}
                        height={600}
                        data={new URL(url).href}
                    >
                        <i>File display</i>
                    </object>
                )}
            }}
        />
    )
}

export default Viewer;
